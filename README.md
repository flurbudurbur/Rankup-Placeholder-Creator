# Getting Started

1. Install Tailwind
    - `npm install -D tailwindcss`
    - `npx tailwindcss init`
2. Start Tailwind
    - `npx tailwindcss -i ./css/dev/input.css -o ./css/dev/output.css --watch`
3. Compile for production
    - `npx tailwindcss -o ./css/style.css --minify`

## Feel like a filter should be recommended?

Well, the backend is there for it! You only need to add a `data-recommendedFormat` tag to an `option` element and put the `id` as the value. That's it!
  
## Todos
1. Make a mobile-friendly version
