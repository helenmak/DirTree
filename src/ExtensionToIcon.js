const icons = {
    zip: 'archive.svg',
    rar: 'archive.svg',
    '7z': 'archive.svg',
    config: 'config.svg',
    css: 'css.svg',
    eslintrc: 'eslint.svg',
    gulp: 'gulp16.svg',
    htaccess: 'htaccess.svg',
    html: 'html.svg',
    lang: 'i18n.svg',
    png: 'ImagesFileType.svg',
    jpg: 'ImagesFileType.svg',
    jpeg: 'ImagesFileType.svg',
    svg: 'ImagesFileType.svg',
    jade: 'jade.svg',
    java: 'java.svg',
    js: 'javaScript.svg',
    json: 'json.svg',
    jsx: 'jsx.svg',
    less: 'less.svg',
    php: 'php-icon.svg',
    pug: 'pug.svg',
    py: 'pythonFile.svg',
    exe: 'runConfigurationDeclaration.png',
    sass: 'sass.svg',
    txt: 'text.svg',
    tsx: 'tsx.svg',
    ts: 'TypeScriptFile.svg',
    vue: 'vue.png',
    xhtml: 'xhtml.svg',
    xml: 'xml.svg',
    yaml: 'yaml.svg'
}

export default function getIcon(ext = '') {
    const icon = icons[ext];
    
    if (!icon) {
        return 'unknown.svg'
    }
    
    return icon
}
