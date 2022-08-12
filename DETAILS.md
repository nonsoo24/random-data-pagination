# How it works

- I created some variables called tableData, keys, results, lastKey and hasNextPage.

- On load of the page the loadTable function is called with the default url.

- It displays a loading text while fetching data and loading the table

- After the data has been fetched. I then separate the values fetched into keys, results and tableData. The key variable keeps tracks of the page number. The hasNextPage variable helps to determine which data to display or if a new data needs to be fetched. The endpoint returns data of two pages at a time.

- If hasNextPage is zero, items of the first page in the results will be displayed using key[0]. If hasNextPage is one, items of the second page in the results will be displayed using key[1]. If hasNextPage is two, it means I will have to fetch a new data.

- The toggleButton disables/enables the previous and next button. If there is a next or previous links it enables the buttons and vice versa 