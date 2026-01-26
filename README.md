# Advanced YouTube Search

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

[![GitHub Stars](https://img.shields.io/github/stars/bitgineer/Advanced-YouTube-Search.svg?style=social&label=Star)](https://github.com/bitgineer/Advanced-YouTube-Search/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/bitgineer/Advanced-YouTube-Search.svg?style=social&label=Fork)](https://github.com/bitgineer/Advanced-YouTube-Search/network/members)

Welcome to **Advanced YouTube Search** – a powerful Tampermonkey script designed to enhance your YouTube searching experience with advanced features. Whether you're looking for specific content, filtering out unwanted results, or refining your search based on various parameters, this script has got you covered!

## 📦 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Customization](#-customization)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## 🚀 Features

**Advanced YouTube Search** offers a comprehensive set of features to refine and enhance your YouTube search capabilities:

### 🔍 Regular Search
- **Standard Search**: Perform regular YouTube searches without any additional parameters.

### 🛠️ Advanced Search Options
- **Exact Term**: Search for exact phrases by enclosing terms in quotes.
- **Exclude Term(s)**: Exclude specific terms from your search results.
- **Title Includes**: Ensure certain keywords are present in the video titles.
- **Video Length**: Filter results based on video duration:
  - Any Length
  - Under 4 minutes
  - 4-20 minutes
  - Over 20 minutes
- **Date After**: Include videos uploaded after a specific date.
- **Date Before**: Include videos uploaded before a specific date.

### 📍 Movable & Toggleable Popup
- **Movable Popup**: Drag the advanced search form to any position on the screen for personalized accessibility.
- **Toggleable Interface**: Easily show or hide the advanced search form with a single click.

### 🎯 Date Preset Buttons
- **Quick Date Filters**: Instantly apply common date ranges:
  - **Last Hour**: Videos from the past hour
  - **Today**: Videos from the past 24 hours
  - **This Week**: Videos from the past 7 days
  - **This Month**: Videos from the past 30 days

### 🎨 User-Friendly Interface
- **Clean Design**: Seamlessly integrates with YouTube's interface without clutter.
- **Responsive Layout**: Optimized for various screen sizes and devices.

## 🛠️ Installation

To get started with **Advanced YouTube Search**, follow these simple steps:

### 1. Install Tampermonkey

**Tampermonkey** is a popular userscript manager available for various browsers.

- **Google Chrome**: [Tampermonkey Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- **Mozilla Firefox**: [Tampermonkey Firefox Add-ons](https://addons.mozilla.org/firefox/addon/tampermonkey/)
- **Microsoft Edge**: [Tampermonkey Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/iikmkjmpaadaobahmlepeloendndfphd)
- **Safari**: [Tampermonkey Safari Downloads](https://apps.apple.com/app/tampermonkey/id6738342400)

### 2. Clone or Download the Repository

You can clone the repository using Git or download it as a ZIP file.

```bash
git clone https://github.com/bitgineer/Advanced-YouTube-Search.git
```

Alternatively, download the repository as a ZIP from the [GitHub page](https://github.com/bitgineer/Advanced-YouTube-Search).

### 3. Install the Userscript

1. Open the `Advanced YouTube Search` repository.
2. Locate the `AdvancedYouTubeSearch.user.js` file.
3. Click on the file to view its contents.
4. Click the **Raw** button to open the raw script.
5. Tampermonkey should automatically detect the script and prompt you to install it.
6. Confirm the installation by clicking **Install** in the Tampermonkey dialog.

> **Alternatively**, you can manually add the script:
> - Open Tampermonkey Dashboard.
> - Click on **Add a new script**.
> - Paste the script contents from `AdvancedYouTubeSearch.user.js`.
> - Save the script.

## 📝 Usage

Once installed, **Advanced YouTube Search** enhances your YouTube experience as follows:

### 1. Open YouTube

Navigate to [YouTube](https://www.youtube.com/) in your browser.

### 2. Access the Advanced Search Popup

- Click on the **🔍 Advanced Search** button fixed at the bottom-right corner of the page.
  
  ![Toggle Button](screenshots/toggle-button.png)

### 3. Perform a Regular Search

- **Regular Search Section**:
  - Enter your standard search query in the **Search** field.
  
  ![Regular Search](screenshots/regular-search.png)

### 4. Utilize Advanced Search Options

- **Advanced Options Section**:
  - **Exact Term**: Enter exact phrases (e.g., `"Awesome List"`).
  - **Exclude Term(s)**: Enter terms to exclude, separated by commas (e.g., `spam, ads`).
  - **Title Includes**: Enter keywords to include in video titles, separated by commas (e.g., `tutorial`).
  - **Video Length**: Select the desired video duration.
  - **Date After**: Choose a start date to include videos uploaded after this date.
  - **Date Before**: Choose an end date to include videos uploaded before this date.
  
  ![Advanced Search](screenshots/advanced-search.png)

### 5. Execute the Search

- Click the **Search** button to perform the search with the specified parameters.
- You will be redirected to the YouTube search results page with your filters applied.

### 6. Move the Popup (Optional)

- Click and hold the **Advanced YouTube Search** header.
- Drag the popup to your preferred location on the screen.
  
  ![Draggable Popup](screenshots/draggable-popup.gif)

### 7. Close the Popup

- Click the **🔍 Advanced Search** button again.
- Alternatively, click anywhere outside the popup to close it.

## 🎨 Customization

You can customize **Advanced YouTube Search** to better fit your preferences:

### 1. Change Toggle Button Position

Modify the script to reposition the toggle button. For example, to move it to the top-right corner:

```javascript
toggleButton.style.top = '20px';
toggleButton.style.bottom = 'auto';
toggleButton.style.right = '20px';
```

### 2. Adjust Popup Size

Change the width of the popup:

```javascript
popupDiv.style.width = '450px'; // Adjust the width as desired
```

### 3. Modify Styles

Customize colors, fonts, or other styles by editing the corresponding CSS properties in the script.

### 4. Set Default Values

Pre-fill search fields by setting default `value` attributes when creating input elements in the script.

## 🔬 Advanced: YouTube Sort Operators

### Understanding YouTube's `sp` Parameter

YouTube uses a special **`sp`** parameter in URLs to control sorting and filtering of search results. This parameter is **base64-encoded binary data** that represents various filters and sort orders.

### Available Sort Operators

Although YouTube removed some sorting options from the UI (like "Sort by Upload Date" and "Sort by View Count"), **these features still work via URL parameters**:

| Sort Type | sp Parameter | URL Encoded | Example URL |
|-----------|--------------|-------------|-------------|
| **Upload Date** | `sp=CAI=` | `sp=CAI%3D` | `https://www.youtube.com/results?search_query=test&sp=CAI%3D` |
| **View Count** | `sp=CAM%3D` | `sp=CAM%253D` | `https://www.youtube.com/results?search_query=test&sp=CAM%253D` |
| **Rating** | `sp=CAE%3D` | `sp=CAE%253D` | `https://www.youtube.com/results?search_query=test&sp=CAE%253D` |

### How to Extract `sp` Values

You can find the `sp` value for any filter combination directly from YouTube:

1. Open [YouTube](https://www.youtube.com/) and perform a search
2. Click the **Filters** button in the top-right
3. Select your desired filters (upload date, duration, features, etc.)
4. Look at the URL in your browser's address bar
5. Copy the `sp` parameter value

**Example URL after applying filters:**
```
https://www.youtube.com/results?search_query=python+tutorial&sp=CAISAhAB
```

### Technical Details

The `sp` parameter structure:

- **Format**: Base64-encoded binary data
- **Structure**: 2-byte header + filter words
- **Header**:
  - First byte: Constant (`00010010`)
  - Second byte: Filter counter + special filter toggle
- **Filters**: 2-byte or 3-byte words representing different filter types

### Common Filter Values

| Filter Type | Values |
|-------------|--------|
| **Upload Date** | Last hour, Today, This week, This month, This year |
| **Duration** | Under 4 min, 4-20 min, Over 20 min |
| **Features** | Live, 4K, HD, Subtitles, 360°, VR180, HDR, 3D |
| **Type** | Video, Channel, Playlist, Movie |

### Implementation Notes

- The `sp` parameter is **not officially documented** by YouTube
- These parameters may change without notice
- For production applications, consider using the official [YouTube Data API v3](https://developers.google.com/youtube/v3/docs/search/list) with the `order` parameter
- This userscript currently implements date filtering using the `after:` and `before:` search operators, which are more reliable than `sp` parameters

### Recent YouTube Changes (2025-2026)

YouTube made significant changes to search filters:

- **Removed**: "Sort By" → Renamed to **"Prioritize"**
- **Removed**: "View Count" → Renamed to **"Popularity"**
- **Removed UI options**: Sort by Upload Date, View Count, and Rating from the interface
- **Still Working**: URL-based `sp` parameters continue to function

### Sources

- [SerpApi: Paginating, Sorting, and Filtering with the YouTube API](https://serpapi.com/blog/youtube-sp-filters-paginating-sorting-and-filtering-with-the-youtube-api/)
- [ktsk.xyz: Decoding YouTube filters](https://ktsk.xyz/docs/programming/decoding-youtube-filters/)
- [YouTube Data API v3 Documentation](https://developers.google.com/youtube/v3/docs/search/list)

## 🤝 Contributing

Contributions are welcome! If you'd like to improve **Advanced YouTube Search**, please follow these steps:

1. **Fork the Repository**

   Click the **Fork** button at the top-right corner of the [repository page](https://github.com/bitgineer/Advanced-YouTube-Search).

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/bitgineer/Advanced-YouTube-Search.git
   ```

3. **Create a Feature Branch**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

4. **Commit Your Changes**

   ```bash
   git commit -m "Add your descriptive commit message"
   ```

5. **Push to Your Fork**

   ```bash
   git push origin feature/YourFeatureName
   ```

6. **Open a Pull Request**

   Navigate to the original repository and open a pull request with your changes.

### 📜 Guidelines

- Ensure your code follows the existing style and structure.
- Provide clear and concise commit messages.
- Include screenshots or descriptions for new features.
- Test your changes thoroughly before submitting.

## 📝 License

This project is licensed under the [MIT License](LICENSE).

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## 📫 Contact

For any inquiries, suggestions, or feedback, feel free to reach out:

- **GitHub**: [@bitgineer](https://github.com/bitgineer)
- **Email**: [bitgineer@use.startmail.com](mailto:bitgineer@use.startmail.com)

---

Made with ❤️ by [bitgineer](https://github.com/bitgineer)
