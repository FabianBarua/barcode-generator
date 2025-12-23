# 🏷️ Barcode Generator

A modern, free online barcode generator built with React, TypeScript, and Vite. Create, customize, and manage multiple barcode formats with ease.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://barcode-generator-svg.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## ✨ Features

- 🎨 **Multiple Formats**: Support for CODE128, CODE39, EAN-13, EAN-8, UPC, ITF-14, MSI, Pharmacode, and Codabar
- 🎭 **Custom Text**: Generate barcodes from any text or numbers
- 🎨 **Full Customization**: Adjust width, height, colors, font size, margins, and more
- 💾 **Library Management**: Save, organize, and edit your barcodes
- 📥 **Import/Export**: Backup and restore your barcode collection as JSON
- 🌙 **Dark Mode**: Beautiful light and dark themes
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🎉 **Confetti Effects**: Celebrate when saving barcodes
- 🔍 **Search**: Quickly find barcodes in your library
- 📦 **Persistent Storage**: All data saved locally using Zustand with persistence

## 🚀 Live Demo

Visit the live application: [barcode-generator-svg.vercel.app](https://barcode-generator-svg.vercel.app/)

## 🛠️ Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite (Rolldown)
- **State Management**: Zustand
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS 4
- **Barcode Library**: react-barcode
- **Icons**: Lucide React
- **Animations**: canvas-confetti
- **Notifications**: Sonner

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/fabianbarua/barcode-generator.git

# Navigate to project directory
cd barcode-generator

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 🏗️ Available Scripts

```bash
# Development
pnpm dev          # Start dev server on http://localhost:5173

# Build
pnpm build        # Type-check and build for production

# Lint
pnpm lint         # Check code quality

# Preview
pnpm preview      # Preview production build
```

## 🎯 Usage

### Generate a Barcode

1. Select your desired format from the dropdown
2. Enter your text or code
3. For EAN-13, select a country prefix and generate random codes
4. Customize appearance using the settings panel
5. Download as SVG or copy the code

### Save to Library

1. Click the "Save" button
2. Give your barcode a name
3. It will be stored locally and appear in your library

### Manage Library

- Click the "Library" button to view all saved barcodes
- Search by name or code
- Edit existing barcodes by clicking the edit icon
- Delete barcodes you no longer need

### Backup & Restore

1. Open Settings
2. Click "Export" to download your barcodes as JSON
3. Use "Import" to restore from a backup file

## 🎨 Supported Formats

| Format | Description | Use Case |
|--------|-------------|----------|
| CODE128 | Alphanumeric, high-density | General purpose, shipping |
| CODE39 | Alphanumeric, widely used | Industrial, logistics |
| EAN-13 | 13-digit numeric | Retail products worldwide |
| EAN-8 | 8-digit numeric | Small retail items |
| UPC | 12-digit numeric | North American retail |
| ITF-14 | 14-digit numeric | Carton identification |
| MSI | Numeric | Inventory control |
| Pharmacode | Numeric | Pharmaceutical packaging |
| Codabar | Numeric + special chars | Libraries, blood banks |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Fabian Barua**

- Website: [fabianbarua.vercel.app](https://fabianbarua.vercel.app/)
- GitHub: [@fabianbarua](https://github.com/fabianbarua)

## 🙏 Acknowledgments

- [react-barcode](https://github.com/kciter/react-barcode) for the barcode generation library
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Vercel](https://vercel.com/) for hosting

## 📸 Screenshots

### Light Mode
![Light Mode](screenshots/light-mode.png)

### Dark Mode
![Dark Mode](screenshots/dark-mode.png)

### Library Management
![Library](screenshots/library.png)

---

Made with ❤️ by [Fabian Barua](https://fabianbarua.vercel.app/)
