removeFromStorage = (storage, event) => {
    if (event.target.classList.contains('delete')) {
        if (confirm('Are you sure?') === false) { return; }

        const key = event.target.dataset.local;
        storage.removeItem(key);
        getLocalStorageItems();
    }
}

function handleFromStorage(event) {
    removeFromStorage(event.target.classList.contains('localList') ? localStorage : sessionStorage, event);
}

deleteFromStorage = (storage, event) => {
    if (event.target.classList.contains('deleteall')) {
        if (confirm('Are you sure?') === false) { return; }

        const checkedItems = document.querySelectorAll(`.${storage === localStorage ? 'localListCheck' : 'sessionListCheck'}:checked`);
        checkedItems.forEach(item => {
            storage.removeItem(item.value);
        });

        getLocalStorageItems();
    }
}

function deletFromStorage(event) {
    deleteFromStorage(event.target.classList.contains('localList') ? localStorage : sessionStorage, event);
    deleteFromStorage(event.target.classList.contains('sessionList') ? localStorage : sessionStorage, event);
}

setStorage = (storage, list) => {
    for (let i = 0; i < storage.length; i++) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');

        const spanKey = document.createElement('b');
        spanKey.textContent = `${storage.key(i)}`;

        const spanValue = document.createElement('span');
        spanValue.innerHTML = storage.getItem(storage.key(i));

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'float-end', 'delete', `${list.id}`);
        deleteButton.innerHTML = 'Delete';
        deleteButton.dataset.local = storage.key(i);

        const div = document.createElement('div');
        div.classList.add('form-check');

        const checkInput = document.createElement('input');
        checkInput.classList.add('form-check-input', `${list.id}Check`);
        checkInput.type = 'checkbox';
        checkInput.value = storage.key(i);
        checkInput.id = `${list.id}Check`;

        div.appendChild(checkInput);
        div.appendChild(spanKey);
        div.appendChild(document.createTextNode(' : '));
        div.appendChild(spanValue);
        div.appendChild(document.createTextNode(' '));
        div.appendChild(deleteButton);

        li.appendChild(div);
        list.appendChild(li);

        const deleteAllbtn = document.getElementById('delete-all');
        deleteAllbtn.classList.add('btn', 'btn-danger', 'mt-3', 'btn-sm', 'deleteall', `${list.id}`);
        deleteAllbtn.dataset.local = storage.key(i);

        checkInput.addEventListener('change', (event) => {
            if (event.target.checked) {
                deleteButton.style.display = 'none';
                deleteAllbtn.classList.remove('d-none')
            } else {
                deleteButton.style.display = 'block';
                deleteAllbtn.classList.add('d-none')
            }
        })
    }
}

getLocalStorageItems = () => {
    const list = document.getElementById('localList');
    const sessionList = document.getElementById('sessionList');

    document.querySelectorAll('ul')
        .forEach(ul => {
            ul.innerHTML = '';
            ul.classList.add('list-group', 'list-group-flush');
        });

    setStorage(localStorage, list);
    setStorage(sessionStorage, sessionList);
};

document.addEventListener('DOMContentLoaded', function () {
    getLocalStorageItems();

    const keyInput = document.getElementById('key');
    const valueInput = document.getElementById('value');
    const saveButton = document.getElementById('btn-save');
    const list = document.getElementById('localList');
    const sessionList = document.getElementById('sessionList');

    list.addEventListener('click', handleFromStorage);
    sessionList.addEventListener('click', handleFromStorage);

    saveButton.addEventListener('click', function () {
        const value = valueInput.value;
        const key = keyInput.value;

        localStorage.setItem(key, value);
        sessionStorage.setItem(key, value);

        getLocalStorageItems();
        document.querySelectorAll('input').forEach(input => input.value = '');
    });

    function toggleCheckboxes(masterCheckboxId, checkboxClass) {
        const masterCheckbox = document.getElementById(masterCheckboxId);
        masterCheckbox.addEventListener('change', function () {
            document.querySelectorAll(`.${checkboxClass}`).forEach(input => {
                input.checked = masterCheckbox.checked;
                const deleteButtons = document.querySelectorAll(`.${checkboxClass.replace('Check', '')} .delete`);
                const deleteAllbtn = document.getElementById('delete-all');
                if (masterCheckbox.checked) {
                    deleteButtons.forEach(btn => btn.style.display = 'none');
                    deleteAllbtn.classList.remove('d-none');
                } else {
                    deleteButtons.forEach(btn => btn.style.display = 'block');
                    deleteAllbtn.classList.add('d-none');
                }
            });
        });
    }

    toggleCheckboxes('localCheck', 'localListCheck');
    toggleCheckboxes('sessionCheck', 'sessionListCheck');
});

document.getElementById('delete-all').addEventListener('click', (event) => {
    deleteFromStorage(localStorage, event);
    deleteFromStorage(sessionStorage, event);
});
