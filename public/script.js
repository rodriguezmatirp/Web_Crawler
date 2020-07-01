console.log('application running on client side')

const $web_form = document.querySelector('#database')
const $searchForm = document.querySelector('#search')
const $urlInput = document.getElementById('url')
const $fromDate = document.getElementById('from')
const $toDate = document.getElementById('to')
const $download = document.querySelector('#download')
const statusText1 = document.querySelector('#status1')
const statusText2 = document.querySelector('#status2')
const statusText3 = document.querySelector('#status3')

$web_form.addEventListener('submit', (e) => {
    e.preventDefault()
    const url = $urlInput.value
    statusText1.textContent = 'Downloading data...'
    fetch('/toDatabase?url=' + url).then((res) => {
        if (res.status === "success") {
            statusText1.textContent = 'Gathered Information!!'
        }
    })
})

$searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const from = $fromDate.value
    const to = $toDate.value
    statusText2.textContent = 'Searching...'
    fetch('/search?from=' + from + '&to=' + to).then((res) => {
        res.json().then((data) => {
            if (data.error) {
                console.log('here')
                $download.disabled = true
                statusText2.textContent = 'No data found'
            } else if (data.status) {
                $download.disabled = false
                statusText2.textContent = 'File ready to Download!'
            }
        })
    })
})

$download.addEventListener('click', (e) => {
    fetch('/download')
    location.href = '/download'
})