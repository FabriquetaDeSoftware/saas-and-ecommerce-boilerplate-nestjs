# Products module

`src/modules/products` manages the catalog. There are two kinds of product, stored in separate tables:

| Type (`:type` in the routes) | Table | Paid with |
| --- | --- | --- |
| `single` | `single_purchase_product` | one-time Stripe Checkout |
| `subscription` | `subscription_purchase_product` | subscription Stripe Checkout |

`ProductsOrchestrator` receives the type and delegates to the use case of the right kind (`CreateSingleProductUseCase`, `CreateSubscriptionProductUseCase`, and so on). An unknown type is rejected with `400` by the route validation.

## Routes

| Method | Path | Access | Returns |
| --- | --- | --- | --- |
| POST | `/products/create/:type` | `ADMIN` | `201` product without `id` |
| PATCH | `/products/update/:type/:public_id` | `ADMIN` | `200` product without `id` |
| DELETE | `/products/delete/:type/:public_id` | `ADMIN` | `204` |
| GET | `/products/list-many/:type?page=&pageSize=` | Public | `200` page of products |
| GET | `/products/show-one/:type/:slug` | Public | `200` product without `id` |

List response:

```json
{
  "data": [{ "public_id": "...", "name": "...", "price": 12345, "price_id": "price_...", "slug": "...", "image": [] }],
  "total": 1,
  "page": 1,
  "pageSize": 10,
  "totalPages": 1
}
```

The list omits `id`, `description`, `created_at` and `updated_at`.

## Fields

| Field | Type | Create | Notes |
| --- | --- | --- | --- |
| `name` | string | required | |
| `description` | string | required | |
| `price` | integer | required | In cents. Informational only: the charged amount comes from the Stripe price. |
| `price_id` | string | required | Stripe Price ID (`price_...`). Must be unique. |
| `slug` | string | required | Unique per table. Used by `show-one`. |
| `image` | string[] | optional | Array of URLs. |

On update, every field is optional.

## Permissions

The write routes combine the two access control layers:

1. **RBAC:** `@Roles(RolesEnum.ADMIN, RolesEnum.USER)` lets both roles reach the use case.
2. **ABAC:** the use case asks `PermissionManagerUtil` whether the role can perform the action on every field of the input. `CaslAbilityFactory` only grants `manage` on `Products` to `ADMIN`, so a `USER` gets `401 Unauthorized to perform this action`.

To let other roles manage products, or to restrict fields, change the rules in `src/common/casl/casl_ability.factory.ts`.

## Creating a sellable product

1. In the Stripe dashboard (or API), create a product and a price. Use a one-time price for `single` products and a recurring price for `subscription` products.
2. Sign in as an admin (the seed creates `testadmin@exemple.com` / `Password123!`).
3. Create the product with the Stripe price ID:

   ```bash
   curl -X POST "http://localhost:<MAPPED_PORT_NGINX>/products/create/single" \
     -H "Authorization: Bearer <admin_access_token>" \
     -H "Content-Type: application/json" \
     -d '{"name":"E-book","description":"The best e-book","price":4990,"price_id":"price_123","slug":"e-book"}'
   ```

The product can now be bought through the [billing module](billing.md).

## Known limitations

- A `USER` trying to write gets `401` instead of `403`.
- Updating a `slug` or `price_id` to a value already in use is not checked and fails with `500` (unique constraint).
- Products are not synchronized with Stripe: creating, updating or deleting a product does not touch the Stripe product or price, and changing `price` does not change the charged amount.
- Deleting a product deletes its purchase records too (`onDelete: Cascade`).
- `total` in the list response counts every row, even if a filter is added later (see [Database](../database.md)).
- There is no search, filter, sorting, stock or category support.
