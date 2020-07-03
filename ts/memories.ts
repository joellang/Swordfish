/*****************************************************************************
Copyright (c) 2007-2020 - Maxprograms,  http://www.maxprograms.com/

Permission is hereby granted, free of charge, to any person obtaining a copy of 
this software and associated documentation files (the "Software"), to compile, 
modify and use the Software in its executable form without restrictions.

Redistribution of this Software or parts of it in any form (source code or 
executable binaries) requires prior written permission from Maxprograms.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE.
*****************************************************************************/

class MemoriesView {

    electron = require('electron');

    container: HTMLDivElement;
    tableContainer: HTMLDivElement;
    tbody: HTMLTableSectionElement;

    constructor(div: HTMLDivElement) {
        this.container = div;
        let topBar: HTMLDivElement = document.createElement('div');
        topBar.className = 'toolbar';
        this.container.appendChild(topBar);

        let addButton = document.createElement('a');
        addButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/></svg>' +
            '<span class="tooltiptext bottomTooltip">Add Memory</span>';
        addButton.className = 'tooltip';
        addButton.addEventListener('click', () => {
            this.addMemory()
        });
        topBar.appendChild(addButton);

        let removeButton = document.createElement('a');
        removeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-12v-2h12v2z"/></svg>' +
            '<span class="tooltiptext bottomTooltip">Remove Memory</span>';
        removeButton.className = 'tooltip';
        removeButton.addEventListener('click', () => {
            this.removeMemory()
        });
        topBar.appendChild(removeButton);

        let span1 = document.createElement('span');
        span1.style.width = '30px';
        span1.innerHTML = '&nbsp;';
        topBar.appendChild(span1);

        let importButton = document.createElement('a');
        importButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8 9v-4l8 7-8 7v-4h-8v-6h8zm2-7v2h12v16h-12v2h14v-20h-14z"/></svg>' +
            '<span class="tooltiptext bottomTooltip">Import TMX</span>';
        importButton.className = 'tooltip';
        importButton.addEventListener('click', () => {
            this.importTMX();
        });
        topBar.appendChild(importButton);

        let exportButton = document.createElement('a');
        exportButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M16 9v-4l8 7-8 7v-4h-8v-6h8zm-16-7v20h14v-2h-12v-16h12v-2h-14z"/></svg>' +
            '<span class="tooltiptext bottomTooltip">Export TMX</span>';
        exportButton.className = 'tooltip';
        exportButton.addEventListener('click', () => {
            this.exportTMX();
        });
        topBar.appendChild(exportButton);

        this.tableContainer = document.createElement('div');
        this.tableContainer.classList.add('divContainer');
        this.container.appendChild(this.tableContainer);

        let memoriesTable = document.createElement('table');
        memoriesTable.classList.add('fill_width');
        memoriesTable.classList.add('stripes');
        this.tableContainer.appendChild(memoriesTable);

        memoriesTable.innerHTML =
            '<thead><tr>' +
            '<th><input type="checkbox"></th>' +
            '<th style="padding-left:5px;padding-right:5px;">Name</th>' +
            '<th style="padding-left:5px;padding-right:5px;">Project</th>' +
            '<th style="padding-left:5px;padding-right:5px;">Client</th>' +
            '<th style="padding-left:5px;padding-right:5px;">Subject</th>' +
            '<th style="padding-left:5px;padding-right:5px;">Created</th>' +
            '</tr></thead>';

        this.tbody = document.createElement('tbody');
        memoriesTable.appendChild(this.tbody);
        // event listeners

        this.electron.ipcRenderer.on('set-memories', (event: Electron.IpcRendererEvent, arg: any) => {
            this.displayMemories(arg);
        });

        this.loadMemories();

        this.watchSizes();

        setTimeout(() => {
            this.setSizes();
        }, 200);

    }

    setSizes(): void {
        let main = document.getElementById('main');
        this.container.style.width = main.clientWidth + 'px';
        this.container.style.height = main.clientHeight + 'px';
        this.tableContainer.style.height = (main.clientHeight - 65) + 'px';
        this.tableContainer.style.width = this.container.clientWidth + 'px';
    }

    watchSizes(): void {
        let targetNode: HTMLElement = document.getElementById('main');
        let config: any = { attributes: true, childList: false, subtree: false };
        let observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    this.setSizes();
                }
            }
        });
        observer.observe(targetNode, config);
    }

    loadMemories(): void {
        this.electron.ipcRenderer.send('get-memories');
    }

    addMemory(): void {
        this.electron.ipcRenderer.send('show-add-memory');
    }

    removeMemory(): void {
        // TODO
    }

    importTMX(): void {
        // TODO
    }

    exportTMX(): void {
        // TODO
    }

    displayMemories(memories: any[]) {
        this.tbody.innerHTML = '';
        let length = memories.length;
        for (let i = 0; i < length; i++) {
            let p = memories[i];
            let tr = document.createElement('tr');
            tr.className = 'discover';

            let td = document.createElement('td');
            td.classList.add('fixed');
            td.classList.add('middle');
            td.id = p.id;
            let check: HTMLInputElement = document.createElement('input');
            check.type = 'checkbox';
            check.classList.add('projectCheck');
            check.setAttribute('data', p.id);
            td.appendChild(check);
            tr.appendChild(td);

            td = document.createElement('td');
            td.classList.add('noWrap');
            td.classList.add('middle');
            td.innerText = p.name;
            tr.append(td);

            td = document.createElement('td');
            td.classList.add('noWrap');
            td.classList.add('middle');
            td.classList.add('center');
            td.style.minWidth = '170px';
            td.innerText = p.project;
            tr.append(td);

            td = document.createElement('td');
            td.classList.add('noWrap');
            td.classList.add('middle');
            td.classList.add('center');
            td.style.minWidth = '170px';
            td.innerText = p.client;
            tr.append(td);

            td = document.createElement('td');
            td.classList.add('noWrap');
            td.classList.add('middle');
            td.classList.add('center');
            td.style.minWidth = '170px';
            td.innerText = p.subject;
            tr.append(td);

            td = document.createElement('td');
            td.classList.add('noWrap');
            td.classList.add('middle');
            td.classList.add('center');
            td.style.minWidth = '170px';
            td.innerText = p.creationString;
            tr.append(td);

            this.tbody.appendChild(tr);
        }
    }
}