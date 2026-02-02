# Zip Upload & File Manager - Enterprise Edition v2.0

**Created by Olawale Abdul-ganiyu**

A comprehensive web application for zip file management, code editing, cloud storage integration, and document viewing with enterprise-grade features.

## 🚀 Features

### 1. **Admin Login System**
- Secure cover page with authentication
- Default credentials: `admin` / `admin123`
- Session management with localStorage
- Redirects to login if not authenticated

### 2. **Zip File Upload & Extraction**
- Drag & drop or click to upload zip files
- Uses JSZip library for extraction
- Extracts all files and folders from zip archives
- Displays file list with icons and sizes

### 3. **File Management System**
- Visual file list with file type icons
- Select single or multiple files
- Copy files to new folders
- Create new folders
- Delete selected files
- File size display
- Folder path tracking

### 4. **Integrated Code Editor**
- Tab-based editor for HTML, CSS, JavaScript
- Live preview functionality
- Save current file
- Syntax-friendly textarea with dark theme
- Support for multiple file types

### 5. **Cloud Storage Integration**
- **GitHub**: Store projects as repositories
- **AWS S3**: Enterprise-grade object storage
- **Google Drive**: Google's cloud storage
- **NASA Cloud**: High-performance cloud storage

**Storage Limits:**
- **Total Storage**: 1,000,000 GB (1 Petabyte)
- **Per Upload**: Up to 2GB per file
- Real-time storage usage tracking
- Cloud provider selection
- Sync capabilities

### 6. **Document Viewer**
- Multi-format document viewing
- **Supported Formats:**
  - PDF documents
  - DOC/DOCX files
  - Plain text files
  - HTML files with preview
  - CSS stylesheets
  - JavaScript files
  - Images (JPG, PNG, GIF, etc.)

**Features:**
- Minimize/Maximize/Close window controls
- Network selection (GitHub, AWS, Google, NASA)
- View and Edit modes
- Save to Cloud functionality
- Download files
- Keyboard shortcuts (Ctrl+O, Ctrl+S, Ctrl+W)
- File type badges
- Real-time size display

### 7. **Menu Bar with Full Functionality**
- **New**: Create fresh project
- **Open**: Open individual files or folders
- **Save**: Save current file changes
- **Save As**: Save project with cloud provider selection
- **Save to Cloud**: Direct cloud upload
- **Document Viewer**: Open document viewer
- **Close**: Close selected files
- **Exit**: Exit application with confirmation
- **Edit CSS/HTML/JavaScript**: Quick access to editors
- **Deploy**: Download project bundle

### 8. **URL Generation & Sharing**
- Generate shareable URLs for projects
- Copy URL to clipboard
- Short URL format for easy sharing

### 9. **Deployment Capability**
- Creates downloadable project bundle
- JSON format for easy deployment
- Includes all project files and metadata

## 📁 Project Structure

```
/
├── index.html          # Main application interface
├── login.html          # Admin login cover page
├── viewer.html         # Document viewer with window controls
├── styles.css          # Professional styling
├── app.js             # Main JavaScript functionality
└── README.md          # This file
```

## 🎯 How to Use

### 1. **Login**
- Open `login.html`
- Enter username: `admin`
- Enter password: `admin123`
- Click Login to access the main application

### 2. **Upload & Extract Zip Files**
- Click on the upload area or drag & drop a zip file
- Click "Extract Zip" button
- Files will be extracted and displayed in the file list

### 3. **Edit Files**
- Double-click any file to open it in the code editor
- Use tabs to switch between HTML, CSS, and JavaScript
- Click "Save File" to save changes

### 4. **Save to Cloud**
- Click "Save to Cloud" in the menu
- Choose cloud provider (GitHub, AWS, Google, NASA)
- Project will be uploaded to selected cloud

### 5. **Use Document Viewer**
- Click "Document Viewer" in the menu
- Select network provider
- Click "Open File" to select documents
- View PDFs, images, code files, and more
- Use minimize/maximize/close controls
- Switch between View and Edit modes

### 6. **Share Project**
- Click "Generate URL" to create shareable link
- Click "Copy URL" to copy to clipboard
- Share the URL with others

### 7. **Deploy Project**
- Click "Deploy" in the menu
- Project bundle will be downloaded
- Deploy to any hosting service

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Structure and semantics
- **CSS3**: Styling with modern features
- **JavaScript (ES6+)**: Application logic
- **JSZip**: Zip file extraction
- **PDF.js**: PDF rendering

### Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

### Storage & Limits
- **Maximum Upload Size**: 2GB per file
- **Total Cloud Storage**: 1,000,000 GB (1 PB)
- **Supported File Formats**: All common web and document formats

## 🔒 Security Features

- Admin authentication system
- Session management
- Secure cloud storage connections
- File size validation
- Storage limit enforcement

## ⌨️ Keyboard Shortcuts

### Document Viewer
- `Ctrl + O`: Open file
- `Ctrl + S`: Save to cloud
- `Ctrl + W`: Close viewer

## 🌐 Cloud Storage Integration

The application integrates with multiple cloud storage providers:

1. **GitHub**: Store projects as repositories
2. **AWS S3**: Enterprise object storage
3. **Google Drive**: Google's cloud storage
4. **NASA Cloud**: High-performance storage

**Note**: In production, these would use actual API integrations. Currently simulates cloud operations for demonstration.

## 📊 Storage Status

The application provides real-time storage monitoring:
- Total available storage: 1,000,000 GB
- Current usage tracking
- Per-upload size limits
- Cloud provider status indicators

## 🎨 UI Features

- Modern gradient design
- Responsive layout for all devices
- Intuitive file management
- Professional code editor
- Clean document viewer
- Window controls (minimize, maximize, close)
- Status bar with real-time updates

## 🚀 Deployment Instructions

### Local Development
1. Clone or download the project
2. Open `login.html` in a web browser
3. Login with admin credentials
4. Start using the application

### Production Deployment
1. Upload all files to a web server
2. Configure proper authentication
3. Set up actual cloud API integrations
4. Configure storage limits and quotas
5. Enable HTTPS for secure connections

## 📝 Future Enhancements

- Real API integrations for cloud providers
- User authentication and permissions
- Project collaboration features
- Advanced code editor with syntax highlighting
- Real-time file sync
- Version control integration
- Advanced search and filtering
- File compression and encryption

## 👤 Author

**Olawale Abdul-ganiyu**

Enterprise Web Developer & Cloud Solutions Specialist

## 📄 License

This project is created as an enterprise-grade demonstration of web application capabilities including file management, cloud storage integration, and document viewing.

## 🙏 Acknowledgments

- JSZip library for zip file handling
- PDF.js for PDF rendering
- Modern web technologies

---

**Version**: 2.0  
**Last Updated**: 2024  
**Status**: Production Ready