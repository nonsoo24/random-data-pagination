const tableBodyClass = document.querySelector('.tableBody')
const previousButton = document.querySelector('.prev-button')
const nextButton = document.querySelector('.next-button')
const pageNumber = document.querySelector('.page-number')
const baseUrl = 'https://randomapi.com/api/8csrgnjw?key=LEIX-GF3O-AG7I-6J84'

let tableData = [] // store all data fetched from endpoint here
let results = {}   // store results and paging link here
let keys = [] // keep track of pages in the array
let lastKey = '' // keep track of last page displayed on the table
let hasNextPage = 0 // where 0 = firstPage, 1 = secondPage, 2 = No More Pages

const disableButton = (button) => {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
};

const enableButton = (button) => {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
};

const loadTable = async (url) => {
    tableBodyClass.innerHTML = `<div class="loading">
    <div class="loading-state">loading ...</div>
    </div>`;
    const data = await fetchData(url)
    setData(data)
    hasNextPage = 0
    tableBodyClass.innerHTML = '';
    getNextTableData()
}

const fetchData = async (url) => {
    const response = await fetch(url)
    return await response.json();
}

const setData = (data) => {
    tableData = data
    results = tableData.results[0]
    keys = Object.keys(results)
    toggleButton(results.paging.previous, results.paging.next)
}

  // toggle active state of next and previous button
const toggleButton = (previous, next) => {
    !previous ? disableButton(previousButton) : enableButton(previousButton)
    !next ? disableButton(nextButton) : enableButton(nextButton)
}

const getNextTableData = () => {
    const key = getNextKey()
    if (key) {
        lastKey = key
        createTable(results[key])
    } else {
        loadTable(results.paging.next)
    }

    toggleButton(results.paging.previous, results.paging.next)
}

const getPreviousTableData = async() => {
    const key = getPreviousKey()
    if (key) {
        lastKey = key
        createTable(results[key])
    } else {
        let api = await fetchData(results.paging.previous)
        setData(api)
        getNextTableData()
    }

    toggleButton(results.paging.previous, results.paging.next)
}

const getNextKey = () => {
     //cannot move front if hasNextPage is 2 except hasNextPage 0 or 1
    if (hasNextPage === 0) {
        hasNextPage = 1
        return keys[0]
    } else if (hasNextPage === 1) {
        hasNextPage = 2
        return keys[1]
    } else {
        return false
    }
}

const getPreviousKey = () => {
    //can go back if hasNextPage is 2. Cannot go back if hasNextPage is 0 or 1
    if (hasNextPage === 2) {
        hasNextPage = 0
        return keys[0]
    }

    hasNextPage = 0
    return false
}

const createTable = (data) => {
    const tableRow = data.map((item) => {
        return `<tr data-entryid=${item.row}>
                    <td>${item.row}</td>
                    <td>${item.gender.toUpperCase()}</td>
                    <td>${item.age}</td>
                </tr>`
    }).join('')

    tableBodyClass.innerHTML = tableRow;
    const page = tableData.info?.page
    const showPage = hasNextPage === 1 ? page : hasNextPage === 2 ? Number(page) + 1 : ''
    pageNumber.innerHTML = `Showing Page ${showPage}`
}

window.addEventListener("load", async () => {
    await loadTable(baseUrl)

    // load previous data on click of previous button
    previousButton.addEventListener("click", () => {
        getPreviousTableData()
    });


    // load next data on click of next button
    nextButton.addEventListener("click", () => {
        getNextTableData()
    });

});