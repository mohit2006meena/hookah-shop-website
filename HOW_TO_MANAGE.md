# How to Manage Your Website

Since this is a **Static Website**, you don't need a login or a complicated database. You can update products directly by editing a text file.

## 1. How to Add a New Product

### Step 1: Add the Image

1.  Take a photo of your product.
2.  Copy the image file into the `assets` folder inside your website folder (`c:\programming\Hookah shop website\assets`).
3.  Rename it to something simple, e.g., `new-hookah.jpg`.

### Step 2: Edit the Products Page

1.  Right-click on `products.html` and choose **Open with Notepad** (or VS Code).
2.  Scroll down to the bottom until you see the **Script** section (around line 70).
3.  You will see a list starting with `const products = [`. This is your database.
4.  Add a new line inside the list using this format:

```javascript
{ name: "Your New Product Name", type: "traditional", image: "assets/new-hookah.jpg" },
```

**Types you can use:**

- `"traditional"`
- `"glass"`
- `"flavors"`
- `"accessories"`

### Example

If you want to add a "Blue Glass Hookah", your list should look like this:

```javascript
const products = [
  {
    name: "Classic Brass Hookah",
    type: "traditional",
    image: "assets/shop-exterior.png",
  },
  // ... existing items ...
  { name: "Blue Glass Hookah", type: "glass", image: "assets/blue-hookah.jpg" }, // <--- YOUR NEW ITEM
];
```

5.  **Save the file** (Ctrl + S).
6.  Refresh your browser to see the change!

---

## 2. How to Add Photos to Gallery

1.  Put the new photo in the `assets` folder (e.g., `party-pic.jpg`).
2.  Open `gallery.html` with Notepad.
3.  Find the section `<div class="grid gap-4"...>`.
4.  Copy and paste one of the existing `<div class="gallery-item">` blocks and change the image name.

```html
<div class="gallery-item" onclick="openLightbox('assets/party-pic.jpg')">
  <img src="assets/party-pic.jpg" alt="Party" style="..." />
</div>
```

5.  Save and Refresh.
