# backend

supply your own `OPENAIKEY` in `.env` pls

## API

api is temporarily available at `irscybersec.ml:5170`

### `GET /listing/unsorted`
```typescript
[
  {
    "name": string, //"Gold Medal All-Purpose Flour",
    "id": string, // "fdf160",
    "category": string, //"dry-goods",
    "price": number, //4.66,
    "image": string, //"fdf160.png"
  }
]
```

### `GET /listing/categorised`
```typescript
{
  <category>: [
    {
      "name": string, //"Gold Medal All-Purpose Flour",
      "id": string, // "fdf160",
      "category": string, //"dry-goods",
      "price": number, //4.66,
      "image": string, //"fdf160.png"
    }
  ]
}
```

Some of the categories have very few entries so the data will probably need to be pruned on backend side later

### `POST /_test`
input data:
```typescript
{
  query: string
}
```
output:
```typescript
{
  error: string | undefined, // status 400 if defined
  variant: 'help' | 'item' | undefined,
  item: string, // implies variant==='item'
}

