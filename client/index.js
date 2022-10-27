document.getElementById('upload').addEventListener('click', () => document.location.pathname = 'upload.html')

let search = localStorage.getItem('search') || ''

fetch(`api/getall${search && `?search=${search}`}`, {
    method: 'GET'
}).then(res => res.json()).then(all => {
    const children = []
    all.map(({ name, url, username, password }) => {
        const row = document.createElement('tr')
        const site = document.createElement('td')
        const link = document.createElement('a')
        link.href = url
        link.innerHTML = name
        site.append(link)
        const tdu = document.createElement('td')
        tdu.innerHTML = username
        const tdp = document.createElement('td')
        tdp.innerHTML = '********'
        const showpass = () => {
            tdp.innerHTML = password
            tdp.addEventListener('click', hidepass)
            tdp.removeEventListener('click', showpass)
        }
        const hidepass = () => {
            tdp.innerHTML = '********' 
            tdp.addEventListener('click', showpass) 
            tdp.removeEventListener('click', hidepass)
        }
        tdp.addEventListener('click', showpass)
        row.append(site, tdu, tdp)
        children.push(row)
    })

    document.getElementById('table-body').append(...children)
    
    const searchInput = document.getElementById('search')

    searchInput.value = search
    
    searchInput.addEventListener('change', (e) => {
        localStorage.setItem('search', e.target.value)
        location.reload()
    })
})
