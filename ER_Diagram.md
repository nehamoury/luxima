# LuxeHome E-Commerce Database - ER Diagram

## Entity-Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          LUXEHOME DATABASE ER DIAGRAM                       │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────┐          ┌──────────────────────┐
    │       PRODUCTS       │          │        USERS         │
    ├──────────────────────┤          ├──────────────────────┤
    │ id (PK)      SERIAL  │          │ id (PK)      SERIAL  │
    │ name         VARCHAR │          │ name         VARCHAR │
    │ price        INTEGER │          │ email        VARCHAR │──┐
    │ category     VARCHAR │          │ password     VARCHAR │  │
    │ image        TEXT    │          │ role        VARCHAR  │  │
    │ description  TEXT    │          │ created_at   TIMESTAMP│  │
    │ rating       INTEGER │          └──────────────────────┘  │
    │ stock        INTEGER │                                      │
    │ created_at   TIMESTAMP│         1:N (User → Orders)        │
    └──────────────────────┘           └──────────────────────────┘
                                        │
                                        │
                                        ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                           ORDERS                              │
    ├──────────────────────────────────────────────────────────────┤
    │ id (PK)       SERIAL                                         │
    │ customer      VARCHAR (references users.email)                │
    │ total         INTEGER                                        │
    │ status        VARCHAR                                        │
    │ items         JSONB (Array of product references)            │
                                              │
    └ │ date          DATE──┘
────────────────────────────────────────────────────────────                                    │
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │    ORDER ITEMS        │
                         │    (JSONB Format)     │
                         ├──────────────────────┤
                         │ - product_id          │
                         │ - product_name        │
                         │ - quantity            │
                         │ - price               │
                         │ - image               │
                         └──────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                              RELATIONSHIPS                                   │
└─────────────────────────────────────────────────────────────────────────────┘

    USERS (1) ──────────◄──────────── (N) ORDERS
    │
    │  - One user can have multiple orders
    │  - One order belongs to one user (via customer email)
    │
    ▼

    PRODUCTS (N) ────────◄─────────── (N) ORDERS
    │
    │  - Many products can be in many orders
    │  - Stored as JSONB in order items column
    │


┌─────────────────────────────────────────────────────────────────────────────┐
│                           TABLE SCHEMA SUMMARY                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────┬──────────────┬────────────────────────────────────────────────┐
│   TABLE     │    TYPE      │                    FIELDS                      │
├─────────────┼──────────────┼────────────────────────────────────────────────┤
│  products   │   Main       │ id, name, price, category, image, description, │
│             │   Entity     │ rating, stock, created_at                      │
├─────────────┼──────────────┼────────────────────────────────────────────────┤
│  users      │   Entity     │ id, name, email, password, role, created_at   │
├─────────────┼──────────────┼────────────────────────────────────────────────┤
│  orders     │   Entity     │ id, customer, total, status, items, date      │
└─────────────┴──────────────┴────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW DIAGRAM                                  │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐     POST      ┌──────────┐     INSERT     ┌──────────┐
    │  Client  │ ──────────────▶│  Server  │ ──────────────▶│ Database │
    │(React)   │                │(Express) │                │ (PG)     │
    └──────────┘                └──────────┘                └──────────┘
         │                           │                           │
         │ GET /products             │ SELECT * FROM products   │
         │◀──────────────────────────│◀──────────────────────────┤
         │                           │                           │
         │ POST /users (signup)      │ INSERT INTO users         │
         │◀──────────────────────────│◀──────────────────────────┤
         │                           │                           │
         │ POST /orders              │ INSERT INTO orders        │
         │◀──────────────────────────│◀──────────────────────────┤


┌─────────────────────────────────────────────────────────────────────────────┐
│                           ATTRIBUTE DETAILS                                  │
└─────────────────────────────────────────────────────────────────────────────┘

PRODUCTS:
  - id         : Primary Key, Auto-increment
  - name       : Product name (required)
  - price      : Price in integer (required)
  - category   : Product category (required)
  - image      : Image URL (required)
  - description: Product description (optional)
  - rating     : Rating out of 5 (default: 5)
  - stock      : Available stock (default: 10)
  - created_at : Timestamp of creation

USERS:
  - id         : Primary Key, Auto-increment
  - name       : User's full name (required)
  - email      : Unique email address (required)
  - password   : User's password (required)
  - role       : User role - 'user' or 'admin' (default: 'user')
  - created_at : Timestamp of registration

ORDERS:
  - id         : Primary Key, Auto-increment
  - customer   : Customer email (foreign key to users)
  - total      : Total order amount
  - status     : Order status (default: 'Processing')
  - items      : JSON array of ordered products
  - date       : Order date
