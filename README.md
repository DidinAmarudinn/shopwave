# ShopWave

A colorful demo e-commerce catalog built with vanilla HTML, CSS, and JavaScript. Products are loaded from a CSV file at runtime — no build step required.

**Live site:** https://YOUR_USERNAME.github.io/shopwave/

## Features

- Product grid with search by name or SKU
- Product detail pages (`product.html?sku=SKU-001`)
- Privacy Policy and Terms & Conditions pages
- Responsive, colorful design
- 15 dummy products in `data/products.csv`

## Local Development

```bash
python3 -m http.server 8765
```

Open http://localhost:8765

## Deploy to GitHub Pages

```bash
gh auth login
gh repo create shopwave --public --source=. --remote=origin --push
gh api repos/$(gh api user -q .login)/shopwave/pages -X POST \
  -f source[branch]=main -f source[path]=/
```

Your site will be live at `https://<username>.github.io/shopwave/` within a few minutes.

## CSV Format

```csv
sku,product_name,product_url,product_image,short_description
```

| Column | Description |
|--------|-------------|
| `sku` | Unique product identifier |
| `product_name` | Display name |
| `product_url` | URL slug (for reference) |
| `product_image` | Image URL |
| `short_description` | Product description |

## License

Demo project for educational purposes.
