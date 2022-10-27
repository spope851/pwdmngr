const fileReader = new FileReader();

document.getElementById('back').addEventListener('click', () => document.location.pathname = '')

const upload = document.getElementById('upload')
const upStatus = document.getElementById('status')
const submit = document.getElementById('submit')

upload.addEventListener('change', (e) => {
    fileReader.readAsArrayBuffer(upload.files[0]);
    fileReader.onload = async (event) => {
        upStatus.innerHTML = 'uploading...';
        const content = event.target.result;
        // fix chunk size
        const CHUNK_SIZE = 5000;
        // total chunks
        const totalChunks = event.target.result.byteLength / CHUNK_SIZE;
        const fileName = Math.random().toString(36).slice(-6) + '-' + upload.files[0].name;
        // loop over each chunk
        for (let chunk = 0; chunk < totalChunks + 1; chunk++) {
            // prepare the chunk
            let CHUNK = content.slice(chunk * CHUNK_SIZE, (chunk + 1) * CHUNK_SIZE)
    
    
            await fetch('/api/upload?fileName=' + fileName, {
                    'method' : 'POST',
                    'headers' : {
                        'content-type' : "application/octet-stream",
                        'content-length' : CHUNK.length,
                    },
                    'body': CHUNK
            })
        }
        upStatus.innerHTML = 'complete!';

        submit.addEventListener('click', async () => {
            await fetch('/api/insert?fileName=' + fileName, {
                'method' : 'POST'
            }).then(
                () => upStatus.innerHTML = 'success!',
                () => upStatus.innerHTML = 'something went wrong.'
            ).finally(() => document.location.pathname = '')
        })

        console.log(`Complete. ${fileName} was processed and destroyed`)
    }
})
