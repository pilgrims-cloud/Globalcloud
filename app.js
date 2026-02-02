// Global variables
let extractedFiles = {};
let currentFolder = 'Root';
let selectedFiles = [];
let currentEditorFile = null;
let projectFiles = {
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Hello World!</h1>
    <script src="script.js"></script>
</body>
</html>`,
    'styles.css': `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    padding: 20px;
}

h1 {
    color: #333;
}`,
    'script.js': `console.log('Hello World!');
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded');
});`
};
let currentProjectName = 'my-project';
let generatedURL = '';
let cloudStorageUsed = 0; // in GB
let currentCloudProvider = 'github'; // github, aws, google, nasa
let maxUploadSize = 2 * 1024 * 1024 * 1024; // 2GB in bytes
let maxTotalStorage = 1000000 * 1024 * 1024 * 1024; // 1,000,000 GB in bytes

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    checkAuth();
    setupEventListeners();
    updateFileList();
    updateCloudStatus();
    updateStatus('Ready');
}

function checkAuth() {
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'login.html';
    }
}

function updateCloudStatus() {
    document.getElementById('cloudUsed').textContent = `${cloudStorageUsed.toFixed(2)} GB`;
}

function setupEventListeners() {
    // Zip file input
    document.getElementById('zipInput').addEventListener('change', handleZipSelect);
    
    // Drag and drop
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', handleTabSwitch);
    });
    
    // Folder input
    document.getElementById('folderInput').addEventListener('change', handleFolderSelect);
    
    // File input
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
}

// Drag and drop handlers
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.background = '#ecf0f1';
}

function handleDragLeave(e) {
    e.currentTarget.style.background = '';
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.style.background = '';
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].name.endsWith('.zip')) {
        document.getElementById('zipInput').files = files;
        updateStatus('Zip file ready to extract');
    }
}

// Zip file handling
function handleZipSelect(e) {
    const file = e.target.files[0];
    if (file) {
        updateStatus(`Zip file selected: ${file.name}`);
    }
}

async function handleZipUpload() {
    const zipInput = document.getElementById('zipInput');
    const file = zipInput.files[0];
    
    if (!file) {
        alert('Please select a zip file first');
        return;
    }
    
    updateStatus('Extracting zip file...');
    
    try {
        const zip = new JSZip();
        const contents = await zip.loadAsync(file);
        extractedFiles = {};
        
        // Process all files in the zip
        const promises = [];
        contents.forEach(function (relativePath, zipEntry) {
            promises.push(processZipEntry(zipEntry));
        });
        
        await Promise.all(promises);
        
        // Copy extracted files to project files
        Object.assign(projectFiles, extractedFiles);
        
        updateFileList();
        updateStatus(`Successfully extracted ${Object.keys(extractedFiles).length} files`);
        alert('Zip file extracted successfully!');
        
    } catch (error) {
        console.error('Error extracting zip:', error);
        alert('Error extracting zip file: ' + error.message);
        updateStatus('Error extracting zip file');
    }
}

async function processZipEntry(zipEntry) {
    if (zipEntry.dir) {
        return;
    }
    
    const content = await zipEntry.async('text');
    extractedFiles[zipEntry.name] = content;
}

// File management
function updateFileList() {
    const fileList = document.getElementById('fileList');
    const files = Object.keys(projectFiles);
    
    if (files.length === 0) {
        fileList.innerHTML = '<p class="no-files">No files yet</p>';
        document.getElementById('fileCount').textContent = '0 files';
        return;
    }
    
    fileList.innerHTML = '';
    files.sort().forEach(filename => {
        const fileItem = createFileItem(filename);
        fileList.appendChild(fileItem);
    });
    
    document.getElementById('fileCount').textContent = `${files.length} files`;
}

function createFileItem(filename) {
    const div = document.createElement('div');
    div.className = 'file-item';
    div.dataset.filename = filename;
    
    const icon = getFileIcon(filename);
    const size = projectFiles[filename].length;
    
    div.innerHTML = `
        <span class="icon">${icon}</span>
        <span class="name">${filename}</span>
        <span class="size">${formatSize(size)}</span>
    `;
    
    div.addEventListener('click', function() {
        selectFile(this);
    });
    
    div.addEventListener('dblclick', function() {
        openFileInEditor(filename);
    });
    
    return div;
}

function getFileIcon(filename) {
    if (filename.endsWith('.html')) return '🌐';
    if (filename.endsWith('.css')) return '🎨';
    if (filename.endsWith('.js')) return '⚡';
    if (filename.endsWith('.png') || filename.endsWith('.jpg') || filename.endsWith('.gif')) return '🖼️';
    if (filename.endsWith('.zip')) return '📦';
    return '📄';
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function selectFile(element) {
    document.querySelectorAll('.file-item').forEach(item => {
        item.classList.remove('selected');
    });
    element.classList.add('selected');
    
    const filename = element.dataset.filename;
    if (!selectedFiles.includes(filename)) {
        selectedFiles.push(filename);
    }
}

function openFileInEditor(filename) {
    currentEditorFile = filename;
    const content = projectFiles[filename] || '';
    document.getElementById('codeEditor').value = content;
    
    // Set active tab based on file type
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (filename.endsWith('.css')) {
        document.querySelector('[data-file="css"]').classList.add('active');
    } else if (filename.endsWith('.js')) {
        document.querySelector('[data-file="javascript"]').classList.add('active');
    } else {
        document.querySelector('[data-file="html"]').classList.add('active');
    }
    
    updateStatus(`Editing: ${filename}`);
}

// Code editor
function handleTabSwitch(e) {
    const fileType = e.target.dataset.file;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Load content for the selected file type
    if (fileType === 'html') {
        openFileInEditor('index.html');
    } else if (fileType === 'css') {
        openFileInEditor('styles.css');
    } else if (fileType === 'javascript') {
        openFileInEditor('script.js');
    }
}

function saveCurrentFile() {
    if (!currentEditorFile) {
        alert('No file is currently being edited');
        return;
    }
    
    const content = document.getElementById('codeEditor').value;
    projectFiles[currentEditorFile] = content;
    updateFileList();
    updateStatus(`Saved: ${currentEditorFile}`);
}

function previewCode() {
    const htmlContent = projectFiles['index.html'] || '';
    const cssContent = projectFiles['styles.css'] || '';
    const jsContent = projectFiles['script.js'] || '';
    
    // Create preview HTML
    const previewHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${cssContent}</style>
        </head>
        <body>
            ${htmlContent.replace(/<head>[\s\S]*?<\/head>/, '')}
            <script>${jsContent}<\/script>
        </body>
        </html>
    `;
    
    const previewFrame = document.getElementById('previewFrame');
    const modal = document.getElementById('previewModal');
    
    previewFrame.srcdoc = previewHTML;
    modal.classList.add('active');
}

function closePreview() {
    document.getElementById('previewModal').classList.remove('active');
}

// Menu functions
function handleNew() {
    if (Object.keys(projectFiles).length > 0 && !confirm('Create new project? Current changes will be lost.')) {
        return;
    }
    
    currentProjectName = 'my-project';
    projectFiles = {
        'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Hello World!</h1>
    <script src="script.js"></script>
</body>
</html>`,
        'styles.css': `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    padding: 20px;
}

h1 {
    color: #333;
}`,
        'script.js': `console.log('Hello World!');
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded');
});`
    };
    
    extractedFiles = {};
    selectedFiles = [];
    currentEditorFile = null;
    document.getElementById('codeEditor').value = '';
    document.getElementById('urlInput').value = '';
    
    updateFileList();
    updateStatus('New project created');
}

function handleOpen() {
    document.getElementById('fileInput').click();
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        const content = event.target.result;
        const filename = file.name;
        
        projectFiles[filename] = content;
        updateFileList();
        openFileInEditor(filename);
        updateStatus(`Opened: ${filename}`);
    };
    
    reader.readAsText(file);
}

function handleFolderSelect(e) {
    const files = e.target.files;
    if (files.length === 0) return;
    
    let processedCount = 0;
    
    Array.from(files).forEach(file => {
        if (!file.webkitRelativePath) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target.result;
            const filename = file.webkitRelativePath;
            projectFiles[filename] = content;
            processedCount++;
            
            if (processedCount === files.length) {
                updateFileList();
                updateStatus(`Opened folder with ${processedCount} files`);
            }
        };
        reader.readAsText(file);
    });
}

function handleSave() {
    saveCurrentFile();
    updateStatus('Project saved');
}

function handleSaveAs() {
    const saveOption = prompt('Choose save option:\n1. Local folder\n2. GitHub\n3. AWS S3\n4. Google Drive\n5. NASA Cloud\n\nEnter 1-5:', '1');
    
    if (!saveOption) return;
    
    const providerNames = {
        '1': 'Local',
        '2': 'GitHub',
        '3': 'AWS S3',
        '4': 'Google Drive',
        '5': 'NASA Cloud'
    };
    
    if (saveOption === '1') {
        // Local save
        const folderName = prompt('Enter new folder name:', currentProjectName);
        if (!folderName) return;
        
        currentProjectName = folderName;
        
        // Create a copy of all files with the new folder prefix
        const newProjectFiles = {};
        Object.keys(projectFiles).forEach(filename => {
            const newFilename = `${folderName}/${filename}`;
            newProjectFiles[newFilename] = projectFiles[filename];
        });
        
        projectFiles = newProjectFiles;
        updateFileList();
        updateStatus(`Project saved locally as: ${folderName}`);
        alert(`Project saved locally as folder: ${folderName}`);
    } else {
        // Cloud save
        const cloudProvider = saveOption === '2' ? 'github' : 
                             saveOption === '3' ? 'aws' : 
                             saveOption === '4' ? 'google' : 'nasa';
        
        currentCloudProvider = cloudProvider;
        
        const folderName = prompt(`Enter folder name for ${providerNames[saveOption]}:`, currentProjectName);
        if (!folderName) return;
        
        currentProjectName = folderName;
        
        // Create a copy of all files with the new folder prefix
        const newProjectFiles = {};
        Object.keys(projectFiles).forEach(filename => {
            const newFilename = `${folderName}/${filename}`;
            newProjectFiles[newFilename] = projectFiles[filename];
        });
        
        projectFiles = newProjectFiles;
        updateFileList();
        
        // Save to cloud
        saveToCloud();
    }
}

function handleClose() {
    if (selectedFiles.length === 0) {
        alert('No file selected to close');
        return;
    }
    
    selectedFiles.forEach(filename => {
        delete projectFiles[filename];
    });
    
    selectedFiles = [];
    currentEditorFile = null;
    document.getElementById('codeEditor').value = '';
    updateFileList();
    updateStatus('Selected files closed');
}

function handleExit() {
    if (confirm('Are you sure you want to exit? All unsaved changes will be lost.')) {
        // In a real browser environment, this would close the tab/window
        alert('Exit clicked. In a browser environment, this would close the application.');
        updateStatus('Application exit requested');
    }
}

// File operations
function copyFiles() {
    if (selectedFiles.length === 0) {
        alert('Please select files to copy');
        return;
    }
    
    const newFolderName = prompt('Enter destination folder name:', 'copy');
    if (!newFolderName) return;
    
    let copiedCount = 0;
    selectedFiles.forEach(filename => {
        const newFilename = `${newFolderName}/${filename.split('/').pop()}`;
        projectFiles[newFilename] = projectFiles[filename];
        copiedCount++;
    });
    
    updateFileList();
    updateStatus(`Copied ${copiedCount} files to ${newFolderName}`);
    alert(`Successfully copied ${copiedCount} files to ${newFolderName}`);
}

function createNewFolder() {
    const folderName = prompt('Enter new folder name:');
    if (!folderName) return;
    
    // Create a placeholder file in the folder
    const placeholderFilename = `${folderName}/README.md`;
    projectFiles[placeholderFilename] = `# ${folderName}\n\nThis folder was created in the file manager.`;
    
    updateFileList();
    updateStatus(`Created folder: ${folderName}`);
}

function deleteSelected() {
    if (selectedFiles.length === 0) {
        alert('Please select files to delete');
        return;
    }
    
    if (!confirm(`Delete ${selectedFiles.length} selected file(s)?`)) {
        return;
    }
    
    selectedFiles.forEach(filename => {
        delete projectFiles[filename];
    });
    
    const deletedCount = selectedFiles.length;
    selectedFiles = [];
    currentEditorFile = null;
    document.getElementById('codeEditor').value = '';
    
    updateFileList();
    updateStatus(`Deleted ${deletedCount} file(s)`);
}

// URL generation
function generateURL() {
    // Create a unique URL based on project content
    const projectContent = JSON.stringify(projectFiles);
    const hash = btoa(unescape(encodeURIComponent(projectContent)));
    
    // Generate a mock URL (in a real app, this would be a server endpoint)
    const baseURL = window.location.origin;
    generatedURL = `${baseURL}/project/${currentProjectName}?hash=${hash.substring(0, 20)}...`;
    
    document.getElementById('urlInput').value = generatedURL;
    updateStatus('URL generated');
    
    alert('URL generated! You can share this link to open the project in another browser.');
}

function copyURL() {
    const urlInput = document.getElementById('urlInput');
    if (!urlInput.value) {
        alert('Please generate a URL first');
        return;
    }
    
    urlInput.select();
    document.execCommand('copy');
    updateStatus('URL copied to clipboard');
    alert('URL copied to clipboard!');
}

// Deployment
function deployProject() {
    if (Object.keys(projectFiles).length === 0) {
        alert('No files to deploy. Please add files to your project first.');
        return;
    }
    
    updateStatus('Preparing deployment...');
    
    // Create a download bundle
    const bundle = {
        projectName: currentProjectName,
        files: projectFiles,
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProjectName}-bundle.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    updateStatus('Project bundle downloaded');
    alert('Project bundle downloaded! You can deploy this file to any hosting service.');
}

// Clear all
function clearAll() {
    if (!confirm('Clear all files and reset the application?')) {
        return;
    }
    
    handleNew();
    document.getElementById('zipInput').value = '';
    updateStatus('Application cleared');
}

// Status updates
function updateStatus(message) {
    document.getElementById('statusText').textContent = message;
}

// Edit functions for menu
function editHTML() {
    openFileInEditor('index.html');
}

function editCSS() {
    openFileInEditor('styles.css');
}

function editJavaScript() {
    openFileInEditor('script.js');
}

// Cloud Storage Functions
function saveToCloud() {
    if (Object.keys(projectFiles).length === 0) {
        alert('No files to save to cloud');
        return;
    }

    // Calculate total size
    let totalSize = 0;
    Object.values(projectFiles).forEach(content => {
        totalSize += content.length;
    });

    // Check upload size limit
    if (totalSize > maxUploadSize) {
        alert(`Project size (${(totalSize / (1024 * 1024 * 1024)).toFixed(2)} GB) exceeds 2GB upload limit`);
        return;
    }

    // Check total storage limit
    if ((cloudStorageUsed * 1024 * 1024 * 1024) + totalSize > maxTotalStorage) {
        alert('Total storage limit would be exceeded');
        return;
    }

    const providerNames = {
        'github': 'GitHub',
        'aws': 'AWS S3',
        'google': 'Google Drive',
        'nasa': 'NASA Cloud'
    };

    // Update storage usage
    cloudStorageUsed += (totalSize / (1024 * 1024 * 1024));
    updateCloudStatus();

    // Simulate cloud upload
    const uploadInfo = `
Saving project to ${providerNames[currentCloudProvider]}...

Project: ${currentProjectName}
Files: ${Object.keys(projectFiles).length}
Size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB
Storage Used: ${cloudStorageUsed.toFixed(2)} GB / 1,000,000 GB

In production, this would:
1. Authenticate with ${providerNames[currentCloudProvider]} API
2. Create a new repository/storage bucket
3. Upload all project files
4. Generate access URLs
5. Return success/failure status
`;

    alert(uploadInfo);
    updateStatus(`Saved to ${providerNames[currentCloudProvider]}: ${currentProjectName}`);
}

function syncWithCloud() {
    const providerNames = {
        'github': 'GitHub',
        'aws': 'AWS S3',
        'google': 'Google Drive',
        'nasa': 'NASA Cloud'
    };

    const syncInfo = `
Syncing with ${providerNames[currentCloudProvider]}...

In production, this would:
1. Fetch all files from ${providerNames[currentCloudProvider]}
2. Compare with local files
3. Download newer/missing files
4. Update local project
5. Show sync summary
`;

    alert(syncInfo);
    updateStatus(`Synced with ${providerNames[currentCloudProvider]}`);
}

function viewCloudFiles() {
    const providerNames = {
        'github': 'GitHub',
        'aws': 'AWS S3',
        'google': 'Google Drive',
        'nasa': 'NASA Cloud'
    };

    const cloudFilesInfo = `
Cloud Files on ${providerNames[currentCloudProvider]}

Storage Used: ${cloudStorageUsed.toFixed(2)} GB / 1,000,000 GB
Available: ${(1000000 - cloudStorageUsed).toFixed(2)} GB

In production, this would show:
- All files stored in cloud
- File sizes and dates
- Download options
- Delete/manage options
- Share links
`;

    alert(cloudFilesInfo);
}

// Document Viewer Access
function openViewer() {
    window.open('viewer.html', '_blank');
}

// Cloud provider selection (would be in settings in real app)
function selectCloudProvider(provider) {
    currentCloudProvider = provider;
    document.querySelectorAll('.provider-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-provider="${provider}"]`).classList.add('selected');
    updateStatus(`Selected cloud provider: ${provider}`);
}