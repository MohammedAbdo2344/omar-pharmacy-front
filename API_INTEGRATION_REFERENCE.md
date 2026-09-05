# Omar Pharmacy API — Frontend Integration Reference

All routes are declared in `routes/api.php` under the `/api/v1` prefix (Laravel auto-prefixes with `/api` via `bootstrap/app.php:9` `api: __DIR__.'/../routes/api.php'`, and the route file itself adds `v1`/`/v1` segments). Base path for every endpoint below: `/api/v1/...`.

Middleware alias registered at `bootstrap/app.php:16-18`:
```php
$middleware->alias([
    'guest.session' => \App\Http\Middleware\GuestSessionAuth::class,
]);
```

---

## 1. Routes

### 1.1 `POST /api/v1/session`
- File: `routes/api.php:14-15`
- Controller: `SessionController::store` (`app/Http/Controllers/Api/SessionController.php:17-25`)
- Middleware: `throttle:10,1` (10 requests/minute). **No `guest.session` middleware** (this is the endpoint that creates the session).
- Request body: none required. Uses `App\DTOs\SessionDTO` (`app/DTOs/SessionDTO.php`) which has empty `rules()`, `defaults()`, `casts()` — effectively no validation.
- Logic (`app/Services/SessionService.php:11-28`):
  ```php
  $token = Str::random(64);
  $tokenHash = hash('sha256', $token);
  GuestSession::createFromToken($tokenHash, $request->ip(), $request->userAgent());
  return $token; // plain token returned to client, NOT the hash
  ```
- Success response — **201**, built via `ResponsesHelper::returnData` (`SessionController.php:21-24`):
  ```json
  {
    "header": [],
    "data": {
      "token": "<64-char random string>",
      "expires_at": "2026-09-05T12:00:00+00:00"
    },
    "code": 201,
    "message": "Session created successfully",
    "success": true,
    "status": 201
  }
  ```
  Note: `expires_at` in the response is computed independently in the controller (`now()->addDays(7)`) at `SessionController.php:23`, a few milliseconds after the DB row's `expires_at` is set in `GuestSession::createFromToken` (`app/Models/GuestSession.php:49`, also `now()->addDays(7)`) — values will normally match to the second but are computed twice, not read back from the DB record.
- No explicit error branch in this controller; a thrown exception would surface as Laravel's default 500 JSON (see §4).

---

### 1.2 Guest-session-protected group
All routes below are declared inside:
```php
Route::prefix('v1')->middleware('guest.session')->group(function () { ... })
```
(`routes/api.php:17`). Every one of them requires a valid `Authorization: Bearer <token>` header (see §2 for full flow/middleware behavior).

#### `GET /api/v1/home`
- File: `routes/api.php:18`
- Controller: `HomeController::index` (`app/Http/Controllers/Api/HomeController.php:16-25`)
- No request params.
- Logic: `app/Services/HomeService.php:12-71`
  - `categories`: top 6 active categories ordered by product count desc, columns `id, name, slug, image, color` (`HomeService.php:15-19`).
  - `products`: combines (in order, deduped by id) — 1 latest `is_best_seller` active product (`flag: 'best_seller'`), 1 latest `is_popular` active product (`flag: 'popular'`), up to 2 active products with an active discount sorted by discount value desc (`flag: 'high_offer'`) (`HomeService.php:21-65`). Each product is `->toArray()` merged with the `flag` key — this returns the raw Eloquent attribute set (id, name, slug, price, stock_quantity, plus whatever eager-loaded relations serialize) since only `first(['id','name','slug','price','stock_quantity'])` columns were selected.
- Success — **200** via `ResponsesHelper::returnData` (`HomeController.php:19-24`):
  ```json
  {
    "header": [],
    "data": {
      "categories": [ { "id": 1, "name": "...", "slug": "...", "image": "...", "color": "..." } ],
      "products": [ { "id": 1, "name": "...", "slug": "...", "price": "12.50", "stock_quantity": 10, "flag": "best_seller" } ]
    },
    "code": 200,
    "message": "Home data retrieved successfully",
    "success": true,
    "status": 200
  }
  ```

#### `GET /api/v1/config`
- File: `routes/api.php:19`
- Controller: `ConfigController::index` (`app/Http/Controllers/Api/ConfigController.php:17-27`)
- Logic: `app/Services/ConfigService.php:12-56` — reads `Setting` rows (`name`/`value` pairs) for a fixed key list and remaps them to response keys shown below.
- Success — **200**:
  ```json
  {
    "header": [],
    "data": {
      "name": null,
      "logo": null,
      "favicon": null,
      "address": null,
      "phone": null,
      "email": null,
      "whatsapp": null,
      "working_hours": null,
      "instagram": null,
      "facebook": null,
      "x": null,
      "currency": null,
      "google_maps_url": null,
      "payment_cod_enabled": null,
      "payment_instapay_enabled": null,
      "payment_instapay_number": null,
      "payment_instapay_name": null
    },
    "code": 200,
    "message": "Config retrieved successfully",
    "success": true,
    "status": 200
  }
  ```
  (Values are `null` whenever the corresponding `settings.name` row does not exist; `Setting::whereIn('name', $keys)->pluck('value','name')` at `ConfigService.php:34-35`.)

#### `GET /api/v1/products`
- File: `routes/api.php:20`
- Controller: `ProductController::index` (`app/Http/Controllers/Api/ProductController.php:18-30`)
- Query params, validated via `App\DTOs\ProductListDTO` (`app/DTOs/ProductListDTO.php:19-27`):
  | param | rules |
  |---|---|
  | `category_id` | `nullable, integer, exists:categories,id` |
  | `min_price` | `nullable, numeric, min:0` |
  | `max_price` | `nullable, numeric, min:0, gte:min_price` |
  | `sort_by_price` | `nullable, string, in:low_to_high,high_to_low` |
  | `search` | `nullable, string, min:1` |
  | `per_page` | `nullable, integer, min:1, max:100` (default `15`, `ProductListDTO.php:32-35`) |
  | `page` | `nullable, integer, min:1` (default `1`) |
  - Because `ProductListDTO` extends `WendellAdriel\ValidatedDTO\ValidatedDTO`, an invalid query throws `Illuminate\Validation\ValidationException` — but `ProductController::index` has **no try/catch**, so this exception is NOT converted by `ResponsesHelper`; it bubbles to Laravel's default exception handler → default Laravel validation JSON shape (see §4), status **422**.
- Success — **200** via `ResponsesHelper::returnData` (`ProductController.php:24-29`), data built in `app/Services/ProductService.php:10-33`:
  ```json
  {
    "header": [],
    "data": {
      "products": [ /* raw Product model array per Product::getFilteredProducts() */ ],
      "pagination": {
        "current_page": 1,
        "last_page": 3,
        "per_page": 15,
        "total": 42
      }
    },
    "code": 200,
    "message": "Products retrieved successfully",
    "success": true,
    "status": 200
  }
  ```

#### `GET /api/v1/products/{slug}`
- File: `routes/api.php:21`
- Controller: `ProductController::show` (`app/Http/Controllers/Api/ProductController.php:32-49`)
- Path param: `slug` (string, no format constraint in route).
- Not-found — **404** via `ResponsesHelper::returnError` (`ProductController.php:36-40`):
  ```json
  { "code": 404, "message": "Product not found", "success": false, "status": 404 }
  ```
- Success — **200** (`ProductController.php:43-48`), data from `app/Services/ProductService.php:35-57`:
  ```json
  {
    "header": [],
    "data": {
      "product": { /* Product::toArrayWithDetails() plus injected category_name, category_id */ },
      "related_products": [ /* up to 3, Product::toArraySimple() */ ]
    },
    "code": 200,
    "message": "Product retrieved successfully",
    "success": true,
    "status": 200
  }
  ```

#### `GET /api/v1/categories`
- File: `routes/api.php:22`
- Controller: `CategoryController::index` (`app/Http/Controllers/Api/CategoryController.php:16-26`)
- Logic: `app/Services/CategoryService.php:9-14` → `Category::getActiveCategories()->toArray()`.
- Success — **200**:
  ```json
  {
    "header": [],
    "data": [ /* array of category records */ ],
    "code": 200,
    "message": "Categories retrieved successfully",
    "success": true,
    "status": 200
  }
  ```

#### `GET /api/v1/cart`
- File: `routes/api.php:25`
- Controller: `CartController::index` (`app/Http/Controllers/Api/CartController.php:25-46`)
- Resolves cart via `guest_session` request attribute + `Auth::id()` (`CartController.php:28-31`) → `CartService::getOrCreateCart` / `getCart`.
- Success — **200**:
  ```json
  {
    "header": [],
    "data": {
      "cart": {
        "id": 1,
        "items": [
          {
            "id": 1,
            "product_id": 5,
            "quantity": 2,
            "unit_price": 19.99,
            "subtotal": 39.98,
            "product": {
              "id": 5,
              "name": "...",
              "slug": "...",
              "price": 19.99,
              "discount_percentage": 0,
              "final_price": 19.99,
              "stock_quantity": 40,
              "stock_availability": "in_stock",
              "primary_image": { "id": 2, "image_path": null, "is_primary": true }
            }
          }
        ],
        "total": 39.98,
        "item_count": 2
      }
    },
    "code": 200,
    "message": "Cart retrieved successfully",
    "success": true,
    "status": 200
  }
  ```
  (`app/Services/CartService.php:44-82` builds this shape. NOTE `primary_image.image_path` will **always be `null`** — see §5.)
- Error — **500** on any exception (`CartController.php:41-44`):
  ```json
  { "code": 500, "message": "Failed to retrieve cart: <exception message>", "success": false, "status": 500 }
  ```

#### `POST /api/v1/cart/items`
- File: `routes/api.php:26`
- Controller: `CartController::store` (`app/Http/Controllers/Api/CartController.php:51-79`)
- Body validated via `App\DTOs\AddToCartDTO` (`app/DTOs/AddToCartDTO.php:12-17`):
  | param | rules |
  |---|---|
  | `product_id` | `required, integer, exists:products,id` |
  | `quantity` | `required, integer, min:1, max:100` (default `1` if omitted, `AddToCartDTO.php:20-24`) |
- Success — **201** (`CartController.php:62-70`):
  ```json
  {
    "header": [],
    "data": {
      "item": {
        "id": 1,
        "product_id": 5,
        "quantity": 2,
        "unit_price": 19.99,
        "subtotal": 39.98
      }
    },
    "code": 201,
    "message": "Item added to cart successfully",
    "success": true,
    "status": 201
  }
  ```
- Validation error — **422** via `ResponsesHelper::returnValidationError` (`CartController.php:71-72`, helper at `app/Helpers/ResponsesHelper.php:58-67`):
  ```json
  {
    "errors": { "product_id": ["The selected product id is invalid."] },
    "code": 422,
    "message": "The selected product id is invalid.",
    "success": false,
    "status": 422
  }
  ```
- Business-rule error (product not found/inactive, out of stock, exceeds stock) — **422** via generic catch (`CartController.php:73-77`), message from `CartService::addItem` thrown exceptions (`app/Services/CartService.php:97,102,111,118`), e.g.:
  ```json
  { "code": 422, "message": "Product is out of stock", "success": false, "status": 422 }
  ```
  (Note: `code`/`status` are hardcoded 422 here even though the underlying condition — e.g. "Product not found or inactive" — is arguably a 404-type error; there is no distinction in the HTTP status.)

#### `PUT /api/v1/cart/items/{product}`
- File: `routes/api.php:27` — `{product}` constrained to `[0-9]+` via `->where('product', '[0-9]+')`.
- Controller: `CartController::update` (`app/Http/Controllers/Api/CartController.php:84-112`)
- Body validated via `App\DTOs\UpdateCartQuantityDTO` (`app/DTOs/UpdateCartQuantityDTO.php:11-16`): `quantity` — `required, integer, min:1, max:100`.
- Success — **200** (`CartController.php:95-103`), same `item` shape as add-to-cart above, wrapped with `message: "Item quantity updated successfully"`.
- Validation error — **422**, same shape as above (`CartController.php:104-105`).
- Business-rule error — **422** (`CartController.php:106-110`), messages from `CartService::updateItemQuantity` (`app/Services/CartService.php:136,146,151,161`): `"Quantity must be greater than 0"`, `"Product not found or inactive"`, `"Requested quantity exceeds available stock"`, `"Item not found in cart"`.

#### `DELETE /api/v1/cart/items/{product}`
- File: `routes/api.php:28` — `{product}` constrained to `[0-9]+`.
- Controller: `CartController::destroy` (`app/Http/Controllers/Api/CartController.php:117-136`)
- No body.
- Success — **200** via `ResponsesHelper::returnSuccessMessage` (`CartController.php:126-129`, helper `ResponsesHelper.php:20-28`):
  ```json
  { "code": 200, "message": "Item removed from cart successfully", "success": true, "status": 200 }
  ```
  Note: this endpoint's success response has **no `data`/`header` keys at all** (different shape from the `returnData` endpoints — see §4). Also note it always returns success even if the item didn't exist, since `CartService::removeItem` just returns a bool from `delete()` which is never checked (`CartController.php:124`, `CartService.php:172-177`).
- Error — **500** (`CartController.php:130-134`):
  ```json
  { "code": 500, "message": "Failed to remove item: <exception message>", "success": false, "status": 500 }
  ```

#### `DELETE /api/v1/cart`
- File: `routes/api.php:29`
- Controller: `CartController::clear` (`app/Http/Controllers/Api/CartController.php:141-160`)
- Success — **200**:
  ```json
  { "code": 200, "message": "Cart cleared successfully. 3 items removed.", "success": true, "status": 200 }
  ```
  (Count interpolated from `CartService::clearCart` return value, `CartController.php:148,151`.)
- Error — **500** (`CartController.php:154-158`), same shape as above with `"Failed to clear cart: <exception message>"`.

#### `POST /api/v1/checkout`
- File: `routes/api.php:32`
- Controller: `CheckoutController::store` (`app/Http/Controllers/Api/CheckoutController.php:22-52`)
- Body validated via `App\DTOs\CheckoutDTO` (`app/DTOs/CheckoutDTO.php:17-27`):
  | param | rules |
  |---|---|
  | `name` | `required, string, max:255` |
  | `email` | `required, email, max:255` |
  | `phone` | `required, string, max:20` |
  | `city` | `required, string, max:100` |
  | `area` | `required, string, max:100` |
  | `building_street` | `required, string, max:255` |
  | `appartment_number` | `required, string, max:50` |
- Missing/invalid guest session attribute (this is a **secondary, redundant** check — `guest.session` middleware already blocks unauthenticated requests before this controller runs) — **401** (`CheckoutController.php:29-34`):
  ```json
  { "code": 401, "message": "Guest session not found", "success": false, "status": 401 }
  ```
- Validation error — **422**, standard `returnValidationError` shape (`CheckoutController.php:44-45`).
- Business-rule error (empty cart, cart not found, stock unavailable) — **422** via generic catch (`CheckoutController.php:46-50`), message prefixed `"Checkout failed: "` + exception message, e.g. thrown at `app/Services/CheckoutService.php:33` (`"Cart not found for this session"`), `:40` (`"Cart is empty"`), or from `Product::validateStockAvailability` (stock).
- Success — **201** (`CheckoutController.php:38-43`), data from `CheckoutService::processCheckout` (`app/Services/CheckoutService.php:61-70`, order formatting `121-151`):
  ```json
  {
    "header": [],
    "data": {
      "order": {
        "id": 10,
        "order_number": "...",
        "status": "pending",
        "total": 59.97,
        "shipping_cost": 0,
        "tax": 0,
        "discount": 0,
        "shipping_name": "Jane Doe",
        "shipping_phone": "0100...",
        "shipping_city": "Cairo",
        "shipping_area": "Nasr City",
        "shipping_building_street": "10 Some St",
        "shipping_appartment_number": "3B",
        "items": [
          { "id": 1, "product_id": 5, "product_name": "...", "quantity": 2, "unit_price": 19.99, "subtotal": 39.98 }
        ],
        "created_at": "2026-08-29T12:00:00+00:00"
      },
      "user": { "id": 3, "name": "Jane Doe", "email": "jane@example.com", "phone": "0100..." }
    },
    "code": 201,
    "message": "Checkout completed successfully",
    "success": true,
    "status": 201
  }
  ```

---

## 2. Guest Session Flow (Full Detail)

### 2.1 Token generation (`POST /api/v1/session`)
`app/Services/SessionService.php:11-28`:
```php
$token = Str::random(64);                 // plain, cryptographically-random 64-char token
$tokenHash = hash('sha256', $token);      // sha256 hex digest stored in DB
GuestSession::createFromToken($tokenHash, $request->ip(), $request->userAgent());
return $token;                            // ONLY the plain token is ever returned to the client
```
`GuestSession::createFromToken` (`app/Models/GuestSession.php:45-54`):
```php
public static function createFromToken(string $tokenHash, string $ipAddress, string $userAgent): self
{
    return self::create([
        'token_hash' => $tokenHash,
        'expires_at' => now()->addDays(7),
        'last_activity_at' => now(),
        'ip_address' => $ipAddress,
        'user_agent' => $userAgent,
    ]);
}
```
- Expiry: **7 days** from creation (`now()->addDays(7)`).
- The raw token is **never stored** — only its SHA-256 hash (`token_hash`, unique column, `database/migrations/2026_08_20_154518_create_guest_sessions_table.php:16`). The client must persist the plain token itself (e.g. in localStorage) since the server cannot recover it later.

### 2.2 Sending the token back
Every protected route (everything under the `guest.session` group, `routes/api.php:16`) requires:
```
Authorization: Bearer <plain token from /api/v1/session response.data.token>
```
Read via Laravel's built-in `$request->bearerToken()` (`app/Http/Middleware/GuestSessionAuth.php:14`).

### 2.3 `GuestSessionAuth` middleware behavior
File: `app/Http/Middleware/GuestSessionAuth.php:12-45`
1. No `Authorization: Bearer` header at all → **401**:
   ```json
   { "message": "Token not provided" }
   ```
   (raw shape — NOT `ResponsesHelper`; `GuestSessionAuth.php:17-19`)
2. Token present but `hash('sha256', $token)` matches no `guest_sessions.token_hash` row → **401**:
   ```json
   { "message": "Invalid token" }
   ```
   (`GuestSessionAuth.php:26-29`)
3. Token found but `$guestSession->isExpired()` is true (`expires_at` is in the past — `GuestSession.php:35-38`) → **401**:
   ```json
   { "message": "Token expired" }
   ```
   (`GuestSessionAuth.php:32-35`)
4. Otherwise: `$guestSession->updateLastActivity()` sets `last_activity_at = now()` (`GuestSessionAuth.php:39`, `GuestSession.php:40-43`), then the session model is attached to the request as an attribute: `$request->attributes->set('guest_session', $guestSession)` (`GuestSessionAuth.php:42`) — this is how controllers retrieve it, e.g. `$request->attributes->get('guest_session')` in `CartController.php:28,56,89,120,144` and `CheckoutController.php:27`.

None of these three error responses use `ResponsesHelper` — they are raw `response()->json([...], 401)` calls with only a `message` key (no `code`/`success`/`status`/`data` keys), which is a different shape from every other error in the API (see §4).

### 2.4 Cart ↔ session linkage
`carts` table (`database/migrations/2026_08_20_154651_create_carts_table.php:16-18`) has both `guest_session_id` (nullable FK → `guest_sessions.id`, cascade delete) and `user_id` (nullable FK → `users.id`, cascade delete), plus a **DB-level CHECK constraint** (`:26`):
```sql
ALTER TABLE carts ADD CONSTRAINT check_cart_ownership
CHECK ((guest_session_id IS NOT NULL AND user_id IS NULL)
    OR (guest_session_id IS NULL AND user_id IS NOT NULL)
    OR (guest_session_id IS NULL AND user_id IS NULL))
```
i.e. a cart can belong to a guest OR a user, never both simultaneously.

`CartService::getOrCreateCart` (`app/Services/CartService.php:17-39`):
```php
if ($userId) {
    $cart = Cart::where('user_id', $userId)->first();
} elseif ($guestSession) {
    $cart = Cart::where('guest_session_id', $guestSession->id)->first();
}
if (!$cart) {
    $cart = Cart::create(['guest_session_id' => $guestSession?->id, 'user_id' => $userId]);
}
```
So: authenticated user (via Sanctum/session, `Auth::id()`) takes priority; falls back to guest session lookup; creates a new cart scoped to whichever identity is present.

### 2.5 Guest → user conversion at checkout
`CheckoutService::processCheckout` (`app/Services/CheckoutService.php:23-71`) runs inside `DB::transaction`:
1. `getOrCreateUser($dto)` — looks up `User::findByEmailOrPhone($dto->email, $dto->phone)`; if found, updates name/phone/city/area/building_street/appartment_number; else creates a new user via `User::createFromCheckoutDTO($dto)` (`CheckoutService.php:76-96`).
2. Loads the cart by `Cart::findByGuestSessionId($guestSession->id)` (`:30`) — **note this looks up by guest session, not by `$request->attributes` cart**, so if the guest session had no cart yet, checkout throws `"Cart not found for this session"` (`:32-34`).
3. Validates every cart item's stock (`validateStockAvailability`, `:156-161`).
4. **Converts the cart**: `$this->cartService->convertGuestCartToUser($cart, $user->id)` (`:47`).
5. Creates the `Order` + `OrderItem`s, decrements product stock (`:101-116`).
6. Clears cart items (`:56`).
7. **Links the guest session to the user**: `$guestSession->linkToUser($user->id)` (`:59`).

`CartService::convertGuestCartToUser` (`app/Services/CartService.php:192-206`):
```php
public function convertGuestCartToUser(Cart $cart, int $userId): bool
{
    return DB::transaction(function () use ($cart, $userId) {
        if ($cart->isUserCart()) {
            return false;
        }
        $cart->update([
            'guest_session_id' => null,
            'user_id' => $userId,
        ]);
        return true;
    });
}
```
i.e. it flips the cart's ownership columns in place (satisfying the CHECK constraint above) rather than creating a new cart row. If the cart is already a user cart (`isUserCart()` true), it's a no-op returning `false` (checkout still proceeds — the return value isn't checked in `CheckoutService.php:47`).

`GuestSession::linkToUser` (`app/Models/GuestSession.php:59-62`):
```php
public function linkToUser(int $userId): bool
{
    return $this->update(['user_id' => $userId]);
}
```
This sets `guest_sessions.user_id` — the guest session row itself is **not deleted**; it remains valid (not expired) and still authenticates via `guest.session` middleware after checkout, now additionally associated with a user record. Nothing in the codebase currently causes subsequent requests with the same guest token to resolve as an authenticated Sanctum user — `Auth::id()` in `CartController`/elsewhere depends on Sanctum's own guard, which is unrelated to `guest_sessions.user_id`.

---

## 3. Full Schema (column-by-column, from migration files on disk)

### `users` (`database/migrations/0001_01_01_000000_create_users_table.php:14-22`, extended by `2026_08_18_225549_add_barcode_and_phone_to_users_table.php:14-23`)
| column | type | nullable | default | notes |
|---|---|---|---|---|
| id | bigint (id) | no | — | PK |
| name | string | no | — | |
| email | string | no | — | unique |
| email_verified_at | timestamp | yes | — | |
| password | string | no | — | |
| remember_token | rememberToken (string) | yes | — | |
| barcode | string | yes | — | unique |
| phone | string | yes | — | unique |
| WA_phone | string | yes | — | |
| city | string | yes | — | |
| area | string | yes | — | |
| building_street | string | yes | — | |
| appartment_number | string | yes | — | |
| delivery | boolean | no | `false` | |
| created_at / updated_at | timestamps | yes | — | |

Also in the same migration file (`0001_01_01_000000_create_users_table.php:24-37`): `password_reset_tokens` (`email` PK string, `token` string, `created_at` nullable timestamp) and `sessions` (`id` PK string, `user_id` nullable indexed FK-like bigint, `ip_address` string(45) nullable, `user_agent` text nullable, `payload` longText, `last_activity` integer indexed).

### `categories` (`database/migrations/2025_01_17_000001_create_categories_table.php:14-24`)
| column | type | nullable | default | FK |
|---|---|---|---|---|
| id | bigint | no | — | PK |
| name | string | no | — | |
| slug | string | no | — | unique |
| description | text | yes | — | |
| image | string | yes | — | |
| parent_id | foreignId | yes | — | → `categories.id`, `onDelete('cascade')` |
| is_active | boolean | no | `true` | |
| sort_order | integer | no | `0` | |
| color | string | yes | — | |
| created_at/updated_at | timestamps | yes | — | |

### `products` (`database/migrations/2025_01_17_000002_create_products_table.php:14-33`)
| column | type | nullable | default |
|---|---|---|---|
| id | bigint | no | — |
| name | string | no | — |
| slug | string | no | — (unique) |
| description | text | yes | — |
| short_description | text | yes | — |
| price | decimal(10,2) | no | — |
| cost_price | decimal(10,2) | yes | — |
| stock_quantity | integer | no | `0` |
| low_stock_threshold | integer | no | `10` |
| brand | string | yes | — |
| manufacturer | string | yes | — |
| requires_prescription | boolean | no | `false` |
| is_featured | boolean | no | `false` |
| is_best_seller | boolean | no | `false` |
| is_popular | boolean | no | `false` |
| is_active | boolean | no | `true` |
| created_at/updated_at | timestamps | yes | — |
| deleted_at | softDeletes | yes | — |

### `product_categories` (`database/migrations/2025_01_17_000003_create_product_categories_table.php:14-18`)
| column | type | nullable | FK |
|---|---|---|---|
| product_id | foreignId | no | → `products.id`, cascade delete |
| category_id | foreignId | no | → `categories.id`, cascade delete |
Composite PK: `[product_id, category_id]` (`:17`). No id/timestamps column.

### `product_images` (`database/migrations/2025_01_17_000004_create_product_images_table.php:14-22`)
| column | type | nullable | default | FK |
|---|---|---|---|---|
| id | bigint | no | — | PK |
| product_id | foreignId | no | — | → `products.id`, cascade delete |
| image | string | no | — | **column name is `image`, not `image_path`** |
| alt_text | string | yes | — | |
| sort_order | integer | no | `0` | |
| is_primary | boolean | no | `false` | |
| created_at/updated_at | timestamps | yes | — | |

### `product_discounts` (`database/migrations/2025_01_17_000005_create_product_discounts_table.php:15-27`)
| column | type | nullable | default | FK |
|---|---|---|---|---|
| id | bigint | no | — | PK |
| product_id | foreignId | no | — | → `products.id`, cascade delete |
| type | string | no | — | |
| value | decimal(10,2) | no | — | |
| ends_at | timestamp | yes | — | |
| max_quantity | integer | yes | — | |
| is_active | boolean | no | `true` | |
| created_at/updated_at | timestamps | yes | — | |
Plus raw SQL unique index (`:27`): `CREATE UNIQUE INDEX unique_active_discount_per_product ON product_discounts (product_id) WHERE is_active = true` — enforces at most one active discount per product (Postgres partial index syntax).

### `settings` (`database/migrations/2026_08_18_212024_create_settings_table.php:14-19`)
| column | type | nullable | default |
|---|---|---|---|
| id | bigint | no | — |
| name | string | no | — (unique) |
| value | text | yes | — |
| created_at/updated_at | timestamps | yes | — |

### `guest_sessions` (`database/migrations/2026_08_20_154518_create_guest_sessions_table.php:14-27`)
| column | type | nullable | default | FK |
|---|---|---|---|---|
| id | bigint | no | — | PK |
| token_hash | string | no | — | unique + indexed |
| user_id | foreignId | yes | — | → `users.id`, `onDelete('set null')`, indexed |
| expires_at | timestamp | yes | — | indexed |
| last_activity_at | timestamp | yes | — | |
| ip_address | string(45) | yes | — | |
| user_agent | string | yes | — | |
| created_at/updated_at | timestamps | yes | — | |

### `carts` (`database/migrations/2026_08_20_154651_create_carts_table.php:15-26`)
| column | type | nullable | default | FK |
|---|---|---|---|---|
| id | bigint | no | — | PK |
| guest_session_id | foreignId | yes | — | → `guest_sessions.id`, cascade delete, indexed |
| user_id | foreignId | yes | — | → `users.id`, cascade delete, indexed |
| created_at/updated_at | timestamps | yes | — | |
Plus CHECK constraint `check_cart_ownership` (`:26`, quoted in §2.4).

### `cart_items` (`database/migrations/2026_08_20_154826_create_cart_items_table.php:14-25`)
| column | type | nullable | default | FK |
|---|---|---|---|---|
| id | bigint | no | — | PK |
| cart_id | foreignId | no | — | → `carts.id`, cascade delete, indexed |
| product_id | foreignId | no | — | → `products.id`, cascade delete, indexed |
| quantity | integer | no | `1` | |
| unit_price | decimal(10,2) | no | — | |
| created_at/updated_at | timestamps | yes | — | |
Unique composite index: `[cart_id, product_id]` (`:24`) — one row per product per cart.

### `orders` (`database/migrations/2026_08_20_154838_create_orders_table.php:14-39`)
| column | type | nullable | default | FK |
|---|---|---|---|---|
| id | bigint | no | — | PK |
| user_id | foreignId | no | — | → `users.id`, cascade delete, indexed |
| cart_id | foreignId | yes | — | → `carts.id`, `onDelete('set null')`, indexed |
| order_number | string | no | — | unique |
| status | string | no | `'pending'` | indexed |
| shipping_cost | decimal(10,2) | no | `0` | |
| tax | decimal(10,2) | no | `0` | |
| discount | decimal(10,2) | no | `0` | |
| total | decimal(10,2) | no | `0` | |
| shipping_name | string | no | — | |
| shipping_phone | string | no | — | |
| shipping_city | string | no | — | |
| shipping_area | string | no | — | |
| shipping_building_street | string | yes | — | |
| shipping_appartment_number | string | yes | — | |
| notes | text | yes | — | |
| shipped_at | timestamp | yes | — | |
| delivered_at | timestamp | yes | — | |
| created_at/updated_at | timestamps | yes | — | |
`order_number` is also indexed (`:38`), in addition to being unique.

### `order_items` (`database/migrations/2026_08_20_154914_create_order_items_table.php:14-26`)
| column | type | nullable | default | FK |
|---|---|---|---|---|
| id | bigint | no | — | PK |
| order_id | foreignId | no | — | → `orders.id`, cascade delete, indexed |
| product_id | foreignId | no | — | → `products.id`, cascade delete, indexed |
| product_name | string | no | — | (snapshot of name at order time) |
| quantity | integer | no | — | |
| unit_price | decimal(10,2) | no | — | |
| subtotal | decimal(10,2) | no | — | |
| created_at/updated_at | timestamps | yes | — | |

---

## 4. Response Envelope Inconsistency

Three distinct response shapes coexist in this API:

**Shape A — `ResponsesHelper::returnData`** (`app/Helpers/ResponsesHelper.php:47-57`): `{header, data, code, message, success, status}`. Used by every successful GET/list endpoint and successful cart-item mutations:
- `SessionController.php:21`, `HomeController.php:19`, `ConfigController.php:21`, `ProductController.php:24,43`, `CategoryController.php:20`, `CartController.php:34,62,95`, `CheckoutController.php:38`.

**Shape B — `ResponsesHelper::returnSuccessMessage` / `returnError`** (`ResponsesHelper.php:11-19,20-28`): `{code, message, success, status}` — **no `data` or `header` keys at all**. Used by:
- `CartController.php:126` (`destroy`), `CartController.php:150` (`clear`) — success.
- `ProductController.php:37` (404), `CartController.php:41,74,107,131,155`, `CheckoutController.php:30,47` — errors.

**Shape B2 — `ResponsesHelper::returnValidationError`** (`ResponsesHelper.php:58-67`): `{errors, code, message, success, status}` — has `errors` instead of `data`. Used by `CartController.php:72,105` and `CheckoutController.php:45`.

**Shape C — raw Laravel / non-`ResponsesHelper` JSON** (no `code`/`success`/`status`/`data` keys, just whatever key(s) are passed to `response()->json()`):
- `app/Http/Middleware/GuestSessionAuth.php:17-19,27-29,33-35` — `{"message": "..."}"` only, for all three auth-failure cases (missing/invalid/expired token). Since this middleware runs before any controller/`ResponsesHelper` call on every protected route, **every 401 from token problems has a different, minimal shape** than every other error in the API.
- `ProductListDTO`/`AddToCartDTO`/etc. validation failures thrown as `ValidationException` that are **not caught** (e.g. `ProductController::index` at `app/Http/Controllers/Api/ProductController.php:18-30` has no try/catch around `new ProductListDTO($request->all())`) fall through to Laravel's default JSON exception renderer (`{"message": "...", "errors": {...}}`), status 422 — a *fourth*, framework-default shape, distinct from `ResponsesHelper::returnValidationError`'s `{errors, code, message, success, status}`.
- Any uncaught non-`Exception` throwable (e.g. `TypeError`) anywhere also falls through to Laravel's default handler → default shape (and non-JSON in non-debug/non-API contexts, though `bootstrap/app.php:19-21` forces JSON rendering for `api/*` requests via `shouldRenderJsonWhen`).

**Practical implication for frontend integration:** do not assume every response has `data`/`success`/`code`. A response-parsing layer needs to handle: (1) the `{header,data,code,message,success,status}` envelope, (2) the no-`data` success/error variant, (3) the `errors`-keyed validation variant, and (4) the raw `{"message": "..."}` shape from `GuestSessionAuth` and uncaught `ValidationException`s.

---

## 5. `product_images` Naming Mismatch Bug

- DB column and Eloquent `$fillable` entry are both named **`image`**:
  - Migration: `database/migrations/2025_01_17_000004_create_product_images_table.php:17` — `$table->string('image');`
  - Model: `app/Models/ProductImage.php:15` — `'image'` in `$fillable`.
- But the cart-serialization code reads **`image_path`**, an attribute that does not exist on the model/table:
  - `app/Services/CartService.php:67` — `'image_path' => $item->product->primaryImage->image_path,`
- Since `image_path` is not a real column, Eloquent's magic `__get` returns `null` for it unconditionally (no error thrown) — so `primary_image.image_path` in the `GET /api/v1/cart` response (§1, `/cart` endpoint) will **always serialize as `null`**, even when the product has a real image on file. Frontend cannot rely on this field for the cart view; it must either be fixed server-side (rename to `image` or add an `image_path` accessor/cast) or the frontend should fall back to another source (e.g. re-fetching the product via `GET /api/v1/products/{slug}`, whose `ProductService`/`Product::toArrayWithDetails()` output was not verified to have the same bug — recommend checking `app/Models/Product.php`'s serialization helpers before relying on any `image`/`image_path` field there too).

---

## 6. CORS / Sanctum Configuration

- **`config/cors.php` does not exist** in this project (confirmed via `find . -iname "cors.php" -not -path "*/vendor/*"` — no results). Laravel 11+ ships CORS handling via `HandleCors` middleware which uses framework defaults when no `config/cors.php` is published; with no published config file, **no explicit CORS policy is defined in this codebase** — cross-origin behavior depends entirely on Laravel/Symfony framework defaults (which, without a config file, effectively means the `HandleCors` middleware may not be configured with any custom `allowed_origins`, so CORS behavior should be verified directly against a running instance rather than assumed from source). **Frontend teams on a different origin than the API should flag this for the backend team before integrating** — CORS may need to be explicitly published/configured (`php artisan config:publish cors` or manually adding `config/cors.php`) to allow the SPA's origin, headers (`Authorization`), and methods.
- `bootstrap/app.php:8-21` shows the full middleware/exception configuration for the app — no `HandleCors`-related customization is added here either, and no `web`/`api` middleware groups are customized beyond the `guest.session` alias (`:16-18`).
- **Sanctum** (`config/sanctum.php`):
  - `stateful` domains (`config/sanctum.php:21-26`): `localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1` plus `Sanctum::currentApplicationUrlWithPort()`, sourced from `SANCTUM_STATEFUL_DOMAINS` env var if set.
  - `guard` (`:40`): `['web']`.
  - `expiration` (`:53`): `null` (tokens don't auto-expire via Sanctum's own mechanism; this project's actual token expiry is handled independently by `GuestSession.expires_at`/`isExpired()`, not Sanctum).
  - `token_prefix` (`:68`): empty by default (`env('SANCTUM_TOKEN_PREFIX', '')`).
  - `middleware` (`:81-85`): default `AuthenticateSession`, `EncryptCookies`, `ValidateCsrfToken` classes, unmodified.
  - **Important for the frontend:** none of the routes audited in §1 actually use Sanctum's own auth guard/middleware (`auth:sanctum` is not present anywhere in `routes/api.php`) — all guest-facing endpoints are protected solely by the custom `guest.session` middleware/bearer-token scheme described in §2, not by Sanctum tokens. `Auth::id()` calls in `CartController.php:29,57,90,121,145` would only resolve when a Sanctum-authenticated (or session-authenticated) request is separately established, which nothing in the traced request flow currently sets up — in practice, for all routes exercised through this guest flow, `Auth::id()` will be `null` and every cart/checkout operation resolves via the guest-session path.

---

## Appendix: Related non-endpoint files inspected
- `app/Services/SessionService.php`, `HomeService.php`, `ConfigService.php`, `ProductService.php`, `CategoryService.php`, `CheckoutService.php`
- `app/DTOs/SessionDTO.php`, `ProductListDTO.php`, `AddToCartDTO.php`, `UpdateCartQuantityDTO.php`, `CheckoutDTO.php`
- `app/Models/GuestSession.php`, `app/Models/ProductImage.php`
- `app/Http/Middleware/GuestSessionAuth.php`
- `app/Helpers/ResponsesHelper.php`
- `config/sanctum.php`, `bootstrap/app.php`
