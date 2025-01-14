var fileTypes = ['.jpg','.jpeg','.png','.bmp','.pdf','.xlsx','.xls','.xlm','.xla','.xlc','.xlt','.xlw','.doc','.dot','.docx','.tiff','.tif','.tif','.rtf','.txt','.max','.pdf','.JPG','.JPEG','.PNG','.BMP','.PDF','.XLSX','.XLS','.XLM','.XLA','.XLC','.XLT','.XLW','.DOC','.DOT','.DOCX','.TIFF','.TIF','.TIF','.RTF','.TXT','.MAX','.PDF'];

var variables = {
    dropzone: null,
    completedConfig : {},
    items : [],
    fileTypes: {
        others: {
            jpg: ' dz-image',
            jpeg: ' dz-image',
            png: ' dz-image',
            gif: ' dz-image',
            bmp: ' dz-image',
            pdf: ' dz-pdf',
            doc: ' dz-doc',
            docx: ' dz-doc',
            ppt: ' dz-ppt',
            xls: ' dz-xls',
            xlsx: ' dz-xls',
            txt: ' dz-txt',
            csv: ' dz-csv',
            rtf: ' dz-rtf',
            zip: ' dz-zip',
            rar: ' dz-zip',
        },
        default: ' dz-file'
    },
    messages: {
        supportTypes : {
            title: 'Validation Types Support',
            content: 'The selected file is not supported. The accepted file types are: '
        },
        maxFile : {
            title: 'Validation Max File(s) Support',
            content: 'The dropzone upload support max: '
        },
        maxSize : {
            title: 'Validation Max File Size',
            content: 'The dropzone upload support max filesize: '
        },
        maxTotalSize : {
            title: 'Validation Max Total File Size',
            content: 'The dropzone upload support max total filesize: '
        }
    }
}

var baseProps = {
    name: {},
    config: {},
    id: {},
    maxFile: {},
    mode: {},
    maxSize: {}
}

export { baseProps as Props , variables as Variables, fileTypes as FileTypes }