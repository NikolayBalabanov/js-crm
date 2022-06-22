(() => {
  const container = document.createElement('div');
  container.classList.add('main-container', 'clients');
  const mainBody = document.body;
  mainBody.append(container);

  let currentList = [];

  function createSearchForm() {
    const header = document.createElement('header');
    const logoWrap = document.createElement('div');
    const logo = document.createElement('img');
    const searchForm = document.createElement('form');
    const input = document.createElement('input');

    header.classList.add('clients__header');
    searchForm.classList.add('clients__search');
    logoWrap.classList.add('clients__logo-wrap');
    logo.classList.add('clients__logo');
    input.classList.add('clients__input');
    input.placeholder = 'Введите запрос';

    logo.src = 'img/Logo.svg';

    searchForm.append(input);
    logoWrap.append(logo);
    header.append(logoWrap, searchForm);
    return {
      searchForm,
      header,
      input,
    }
  }

  function createBody() {
    const main = document.createElement('main');
    const title = document.createElement('h2');

    title.textContent = 'Клиенты';

    main.classList.add('clients__main-content', 'main');
    title.classList.add('main__title');

    main.append(title)

    return main
  };

  function createTableHead() {
    const table = document.createElement('table')
    const tableHead = document.createElement('thead')
    const tableRow = document. createElement('tr')

    const id = document.createElement('button')
    const fullName = document.createElement('button')
    const timeCreate = document.createElement('button')
    const timeLastChange = document.createElement('button')
    const contacts = document.createElement('span')
    const actions = document.createElement('span')

    const idCell = document.createElement('th')
    const fullNameCell = document.createElement('th')
    const timeCreateCell = document.createElement('th')
    const timeLastChangeCell = document.createElement('th')
    const contactsCell = document.createElement('th')
    const actionsCell = document.createElement('th')

    const arrowImgId = document.createElement('img')
    arrowImgId.src = 'img/arrowD.svg'
    arrowImgId.classList.add('arrow')

    const arrowImgName = document.createElement('img')
    const imgName = document.createElement('img')
    arrowImgName.src = 'img/arrowD.svg'
    arrowImgName.classList.add('arrow')
    imgName.src = 'img/text.svg'

    const arrowImgTC = document.createElement('img')
    arrowImgTC.src = 'img/arrowD.svg'
    arrowImgTC.classList.add('arrow')

    const arrowImgTL = document.createElement('img')
    arrowImgTL.src = 'img/arrowD.svg'
    arrowImgTL.classList.add('arrow')

    const idWrap = document.createElement('div')
    const nameWrap = document.createElement('div')
    const tcWrap = document.createElement('div')
    const tlWrap = document.createElement('div')
    idWrap.classList.add('cell-wrap')
    nameWrap.classList.add('cell-wrap')
    tcWrap.classList.add('cell-wrap')
    tlWrap.classList.add('cell-wrap')

    table.classList.add('container', 'table')
    id.classList.add('table__head', 'table__head_clickable')
    fullName.classList.add('table__head', 'table__head_clickable')
    timeCreate.classList.add('table__head', 'table__head_clickable')
    timeLastChange.classList.add('table__head', 'table__head_clickable')
    contacts.classList.add('table__head')
    actions.classList.add('table__head')

    id.textContent = 'ID'
    fullName.textContent = 'Фамилия Имя Отчество'
    timeCreate.textContent = 'Дата и время создания'
    timeLastChange.textContent = 'Последнее изменение'
    contacts.textContent = 'Контакты'
    actions.textContent = 'Действия'

    table.append(tableHead)
    tableHead.append(tableRow)
    tableRow.append(idCell, fullNameCell, timeCreateCell, timeLastChangeCell, contactsCell, actionsCell)
    idCell.append(idWrap)
    idWrap.append(id, arrowImgId)
    nameWrap.append(fullName, arrowImgName, imgName)
    tcWrap.append(timeCreate, arrowImgTC)
    tlWrap.append(timeLastChange, arrowImgTL)

    fullNameCell.append(nameWrap)
    timeCreateCell.append(tcWrap)
    timeLastChangeCell.append(tlWrap)
    contactsCell.append(contacts)
    actionsCell.append(actions)

    return {
      table,
      id,
      fullName,
      timeCreate,
      timeLastChange,
      contacts,
      actions,
    }
  };

  function createAddNewClientBtn() {
    const btnContentWrap = document.createElement('div');
    const newClientBtn = document.createElement('button');
    newClientBtn.textContent = 'Добавить клиента';
    newClientBtn.classList.add('clients__btn');
    btnContentWrap.classList.add('clients__btn-wrap');
    btnContentWrap.append(newClientBtn);
    return {
      btnContentWrap,
      newClientBtn,
    };
  };

  function createApp() {
    let search = createSearchForm();
    let body = createBody();
    let getTable = createTableHead();
    let newClientBtn = createAddNewClientBtn();

    async function onSave(formData, getModal) {
      const response = await fetch('http://localhost:3000/api/clients', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json'}
      });
      const ifSuccess = response.status;
      if ((ifSuccess == 201) || (ifSuccess == 200)) {
        getModal.modalElement.remove();
        fillTable()
      }
      else {
        if (ifSuccess == 422) {
          const data = await response.json()
          return data.errors;
        }
        else if (ifSuccess == 404) {
          const data = [{ message: 'Переданный в запросе метод не существует или запрашиваемый элемент не найден в базе данных. Обновите страницу и попробуйте еще.' }]
          return data;
        }
        else if (ifSuccess == 500) {
          const data = [{ message: 'странно, но сервер сломался :(<br>Обратитесь к куратору Skillbox, чтобы решить проблему' }]
          return data;
        }
      }

    }

    function onClose(modalElement) {
      modalElement.remove();
    }

    function onDelete(client, clientRow, modalElement) {
      clientRow.remove()
      fetch(`http://localhost:3000/api/clients/${client.id}`, {
        method: 'DELETE',
      });
      modalElement.remove();
    }

    async function onEdit(client, formData, getModal) {
      const response = await fetch(`http://localhost:3000/api/clients/${client.id}`, {
        method: 'PATCH',
        body: JSON.stringify(formData),
        headers: {'Content-Type': 'application/json'}
      });
      const ifSuccess = response.status;
      if ((ifSuccess == 201) || (ifSuccess == 200)) {
        getModal.modalElement.remove();
        fillTable()
      }
      else {
        if (ifSuccess == 422) {
          const data = await response.json()
          return data.errors;
        }
        else if (ifSuccess == 404) {
          const data = [{ message: 'Переданный в запросе метод не существует или запрашиваемый элемент не найден в базе данных. Обновите страницу и попробуйте еще.' }]
          return data;
        }
        else if (ifSuccess == 500) {
          const data = [{ message: 'странно, но сервер сломался :(<br>Обратитесь к куратору Skillbox, чтобы решить проблему' }]
          return data;
        }
      }
    }

    async function currentClientInfo(clientId) {
      const response = await fetch(`http://localhost:3000/api/clients/${clientId}`);
      const data = await response.json();
      return data;
    }

    container.append(search.header);
    container.append(body);
    body.append(getTable.table);
    body.append(newClientBtn.btnContentWrap);
    newClientBtn.newClientBtn.addEventListener('click', () => {
      createClientModal(null, null, { onSave, onClose });
    });

    function createClientModal(client = null, clientRow = null, { onSave, onClose }) {
      if (client) {
        // формируется модальное окно для изменения данных клиента - client
        const getModal = createModal(client);
        container.append(getModal.modalElement);
        // контакты из API
        const clientContacts = client.contacts;
        clientContacts.forEach( item => {
          const contact = createContactForm(item);
          const choices = new Choices(contact.select, {
            searchEnabled: false,
            position: 'auto',
            shouldSort: false,
            disabled: true,
            placeholder: true,
            itemSelectText: '',
          });
          contact.closeBtn.addEventListener('click', () => {
            checkContactsNumber(getModal.contactsList, getModal.addContactBtn);
          });
          contact.contactInput.addEventListener('input', () => {
            contact.contactInput.classList.remove('contacts-list__item_error');
            getModal.submitBtn.classList.remove('modal__submit_invalid')
          });
          getModal.contactsList.append(contact.contactItem);
          checkContactsNumber(getModal.contactsList, getModal.addContactBtn);
        });
        // добавление новых контактов
        getModal.addContactBtn.addEventListener('click', () => {
          const contact = createContactForm();
          const choices = new Choices(contact.select, {
            searchEnabled: false,
            position: 'auto',
            shouldSort: false,
            placeholder: true,
            itemSelectText: '',
          });
          contact.closeBtn.addEventListener('click', () => {
            checkContactsNumber(getModal.contactsList, getModal.addContactBtn);
          });
          contact.contactInput.addEventListener('input', () => {
            contact.contactInput.classList.remove('contacts-list__item_error');
            getModal.submitBtn.classList.remove('modal__submit_invalid')
          });
          getModal.contactsList.append(contact.contactItem);
          checkContactsNumber(getModal.contactsList, getModal.addContactBtn);
        });
        // обработка отправки измененных данных клиента на сервер
        getModal.form.addEventListener('submit', async function(trySubmitForm) {
          trySubmitForm.preventDefault();
          getModal.nameInput.setAttribute('disabled', 'disabled');
          getModal.lastNameInput.setAttribute('disabled', 'disabled');
          getModal.surnameInput.setAttribute('disabled', 'disabled');
          // запускаем функцию валидации
          const ifValidFields = validateForm(getModal);
          if (ifValidFields) {
            const tryEditClient = await onEdit(client, ifValidFields, getModal);
            if (tryEditClient) {
              const notices = tryEditClient;
              errorNotices(notices, getModal);
            }
          }
        });
        // закрытие модального окна по клику на крестик
        getModal.closeBtn.addEventListener('click', () => {
          onClose(getModal.modalElement);
        });
        // закрытие модального окна по клику на кнопку "отменить"
        getModal.cancelBtn.addEventListener('click', () => {
          deleteClientModal(client, clientRow);
          onClose(getModal.modalElement);
        });
        getModal.surnameInput.addEventListener('input', () => {
          getModal.surnameInput.classList.remove('modal__input_error');
          getModal.submitBtn.classList.remove('modal__submit_invalid')
        });
        getModal.nameInput.addEventListener('input', () => {
          getModal.nameInput.classList.remove('modal__input_error');
          getModal.submitBtn.classList.remove('modal__submit_invalid')
        });

        getModal.modalElement.addEventListener('click', e => {
          if (e.target == getModal.modalElement) {
            onClose(getModal.modalElement);
          }
        })

        return getModal.modalElement;
      }
      else {
        const getModal = createModal();
        container.append(getModal.modalElement);
        getModal.addContactBtn.addEventListener('click', () => {
          const contact = createContactForm();
          const choices = new Choices(contact.select, {
            searchEnabled: false,
            position: 'auto',
            shouldSort: false,
            placeholder: true,
            itemSelectText: '',
          });
          // при удалении контакта, проверяет можно ли показать кнопку "добавить контакт"
          contact.closeBtn.addEventListener('click', () => {
            checkContactsNumber(getModal.contactsList, getModal.addContactBtn);
          });
          contact.contactInput.addEventListener('input', () => {
            contact.contactInput.classList.remove('contacts-list__item_error');
            getModal.submitBtn.classList.remove('modal__submit_invalid')
          });
          getModal.contactsList.append(contact.contactItem);
          // проверяет можно ли показать кнопку "добавить контакт"
          checkContactsNumber(getModal.contactsList, getModal.addContactBtn);
        });

        getModal.form.addEventListener('submit', async (trySubmitForm) => {
          trySubmitForm.preventDefault();
          getModal.nameInput.setAttribute('disabled', 'disabled');
          getModal.lastNameInput.setAttribute('disabled', 'disabled');
          getModal.surnameInput.setAttribute('disabled', 'disabled');
          const ifValidFields = validateForm(getModal);
          if (ifValidFields) {
            const trySaveClient = await onSave(ifValidFields, getModal);
            if (trySaveClient) {
              const notices = trySaveClient;
              errorNotices(notices, getModal);
              getModal.nameInput.removeAttribute('disabled');
              getModal.lastNameInput.removeAttribute('disabled');
              getModal.surnameInput.removeAttribute('disabled');
            };
          };
        });
        getModal.closeBtn.addEventListener('click', () => {
          onClose(getModal.modalElement);
        });
        getModal.cancelBtn.addEventListener('click', () => {
          onClose(getModal.modalElement);
        });
        getModal.surnameInput.addEventListener('input', () => {
          getModal.surnameInput.classList.remove('modal__input_error');
          getModal.submitBtn.classList.remove('modal__submit_invalid')
        });
        getModal.nameInput.addEventListener('input', () => {
          getModal.nameInput.classList.remove('modal__input_error');
          getModal.submitBtn.classList.remove('modal__submit_invalid')
        });

        getModal.modalElement.addEventListener('click', e => {
          if (e.target == getModal.modalElement) {
            onClose(getModal.modalElement);
          }
        })
        return getModal.modalElement;
      };

      function createModal(client = null) {
        const modalElement = document.createElement('div');
        const form = document.createElement('form');
        const formLabel = document.createElement('label');
        const top = document.createElement('div');
        const formTitle = document.createElement('h3');
        const surnameInput = document.createElement('input');
        const nameInput = document.createElement('input');
        const lastNameInput = document.createElement('input');
        const addContactWrap = document.createElement('div');
        const addContactBtn = document.createElement('button');
        const controlBtnsWrap = document.createElement('div');
        const submitBtn = document.createElement('button');
        const cancelBtn = document.createElement('button');
        const closeBtn = document.createElement('button');
        const contactsList = document.createElement('ul');

        modalElement.classList.add('modal');
        form.classList.add('modal__form');
        formLabel.classList.add('modal__label');
        top.classList.add('modal__top');
        formTitle.classList.add('modal__title');

        surnameInput.classList.add('modal__input');
        nameInput.classList.add('modal__input');
        lastNameInput.classList.add('modal__input');
        surnameInput.classList.add('modal__input');
        addContactWrap.classList.add('modal__contacts', 'contacts-list');
        contactsList.classList.add('modal__list');
        addContactBtn.classList.add('modal__add-btn');
        controlBtnsWrap.classList.add('modal__submit-wrap');
        submitBtn.classList.add('modal__submit');
        cancelBtn.classList.add('modal__cancel');
        closeBtn.classList.add('modal__close');

        addContactBtn.setAttribute('type', 'button');
        cancelBtn.setAttribute('type', 'button');
        closeBtn.setAttribute('type', 'button');

        formTitle.textContent = 'Новый клиент';
        surnameInput.placeholder = 'Фамилия*';
        nameInput.placeholder = 'Имя*';
        lastNameInput.placeholder = 'Отчество';
        addContactBtn.textContent = 'Добавить контакт';
        submitBtn.textContent = 'Сохранить';
        cancelBtn.textContent = 'Отмена';

        if (client) {
          const formId = document.createElement('h3');
          const surnameTitle = document.createElement('h3');
          const nameTitle = document.createElement('h3');
          const lastNameTitle = document.createElement('h3');

          formId.classList.add('modal__id');
          surnameTitle.classList.add('modal__sub-title')
          nameTitle.classList.add('modal__sub-title')
          lastNameTitle.classList.add('modal__sub-title')

          formTitle.textContent = 'Изменить данные';
          formId.textContent = `ID: ${client.id}`;
          surnameTitle.textContent = 'Фамилия*';
          nameTitle.textContent = 'Имя*';
          lastNameTitle.textContent = 'Отчество'
          surnameInput.value = client.surname;
          nameInput.value = client.name;
          lastNameInput.value = client.lastName;
          cancelBtn.textContent = 'Удалить клиента';
          surnameInput.placeholder = 'Поле обязательно для заполнения';
          nameInput.placeholder = 'Поле обязательно для заполнения';
          lastNameInput.placeholder = '';

          controlBtnsWrap.append(submitBtn, cancelBtn);
          addContactWrap.append(contactsList, addContactBtn);
          top.append(formTitle, formId);
          formLabel.append(top, surnameTitle, surnameInput, nameTitle, nameInput, lastNameTitle, lastNameInput, closeBtn);
          form.append(formLabel, addContactWrap, controlBtnsWrap);
          modalElement.append(form);
          return {
            modalElement,
            form,
            controlBtnsWrap,
            contactsList,
            addContactBtn,
            addContactWrap,
            nameInput,
            lastNameInput,
            surnameInput,
            submitBtn,
            cancelBtn,
            closeBtn,
          }
        }
        else {
          controlBtnsWrap.append(submitBtn, cancelBtn);
          addContactWrap.append(contactsList, addContactBtn);
          top.append(formTitle);
          formLabel.append(top, surnameInput, nameInput, lastNameInput, closeBtn);
          form.append(formLabel, addContactWrap, controlBtnsWrap);
          modalElement.append(form);
          return {
            modalElement,
            form,
            controlBtnsWrap,
            contactsList,
            addContactBtn,
            addContactWrap,
            nameInput,
            lastNameInput,
            surnameInput,
            submitBtn,
            cancelBtn,
            closeBtn,
          }
        }
      }

      function validateForm(getModal) {
        let contactsInfo = [];
        let errorsList = [];
        let flag = true;
        let selectors = getModal.form.querySelectorAll('.contacts-list__select');
        let selectorsValue = getModal.form.querySelectorAll('.contact-list__input');
        // собираем информацию о контактах
        for (let i = 0; i < selectors.length; i++) {
          let contactInfo = selectorsValue[i].value.trim();
          if (contactInfo) {
            contactsInfo.push({type: selectors[i].value, value: selectorsValue[i].value});
          }
          else {
            selectorsValue[i].classList.add('contacts-list__item_error')
            flag = false;
          };
        };
        if (!flag) {
          errorsList.push({ message: 'Не все добавленные контакты полностью заполнены'});
        };
        let sureNameValidate = getModal.surnameInput.value.trim();
        if (!sureNameValidate) {
          errorsList.push({ message: 'Не указана фамилия'});
          getModal.surnameInput.classList.add('modal__input_error');
        };
        let nameValidate = getModal.nameInput.value.trim();
        if (!nameValidate) {
          errorsList.push({ message: 'Не указано имя'});
          getModal.nameInput.classList.add('modal__input_error');
        }
        if (errorsList.length > 0) {
          errorNotices(errorsList, getModal);
        }
        else {
          const data = {name: nameValidate, surname: sureNameValidate, lastName: getModal.lastNameInput.value ? getModal.lastNameInput.value : '', contacts: contactsInfo};
          return data;
        }
      }

      function createContactForm(item = null) {
        const contactItem = document.createElement('li');
        const closeBtn = document.createElement('button')
        const contactInput = document.createElement('input');
        const select = document.createElement('select');
        const optionTel = document.createElement('option');
        const optionEmail = document.createElement('option');
        const optionFb = document.createElement('option');
        const optionVk = document.createElement('option');
        const optionOther = document.createElement('option');

        contactItem.classList.add('contacts-list__item');

        select.setAttribute('name', 'contacts-select');
        select.classList.add('contacts-list__select');

        contactInput.classList.add('contact-list__input');
        contactInput.placeholder = 'Введите данные контакта';

        closeBtn.classList.add('contact-list__del-btn', 'hidden');
        closeBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0"/>
        </svg>`;

        contactInput.addEventListener('input', () => {
          closeBtn.classList.remove('hidden');
        })

        closeBtn.addEventListener('click', () => {
          contactItem.remove();
        })

        optionTel.setAttribute('value', 'Телефон');
        optionEmail.setAttribute('value', 'Email');
        optionFb.setAttribute('value', 'Facebook');
        optionVk.setAttribute('value', 'Vk');
        optionOther.setAttribute('value', 'Другое');
        optionTel.textContent = 'Телефон';
        optionEmail.textContent = 'Email';
        optionFb.textContent = 'Facebook';
        optionVk.textContent = 'Vk';
        optionOther.textContent = 'Другое';

        if (item) {
          contactInput.value = item.value;
          contactInput.addEventListener('input', () => {})
          checkInput()
          let contactType = item.type;
          switch(contactType) {
            case optionTel.textContent:
              optionTel.setAttribute('selected', 'selected')
              break
            case optionEmail.textContent:
              optionEmail.setAttribute('selected', 'selected')
              break
            case optionFb.textContent:
              optionFb.setAttribute('selected', 'selected')
              break
            case optionOther.textContent:
              optionOther.setAttribute('selected', 'selected')
              break
            case optionVk.textContent:
              optionVk.setAttribute('selected', 'selected')
              break
            default:
              optionOther.setAttribute('selected', 'selected')
              break
          }
        };

        function checkInput() {
          if (contactInput.value.trim()) {
            closeBtn.classList.remove('hidden')
          }
          else {
            closeBtn.classList.add('hidden')
          }
        };

        select.append(optionTel, optionEmail, optionFb, optionVk, optionOther);
        contactItem.append(select, contactInput, closeBtn);
        return  {
          contactItem,
          select,
          contactInput,
          closeBtn,
        };
      };

      function checkContactsNumber(contactsList, addContactBtn) {
        let contacts = contactsList.querySelectorAll('.contacts-list__item').length;
        if (contacts == 0) {
          contactsList.classList.remove('is-contain');
        }
        else if (contacts < 10) {
          contactsList.classList.add('is-contain');
          addContactBtn.classList.remove('hidden');
        }
        else {
          addContactBtn.classList.add('hidden');
        }
      };

      function errorNotices(errorData, getModal) {
        // ищет и удаляет поле с сообщением об ошибке
        const lookForAnOldNotice = getModal.controlBtnsWrap.querySelector('.modal__error');
        if (lookForAnOldNotice) {
          lookForAnOldNotice.remove()
        }
        // создает новое поле с сообщением об ощибке
        const errorWrap = document.createElement('div');
        for (let i in errorData) {
          const errorNotice = document.createElement('p');
          errorNotice.textContent = errorData[i].message;
          errorNotice.classList.add('error__text');
          errorWrap.append(errorNotice);
        }
        getModal.nameInput.removeAttribute('disabled');
        getModal.lastNameInput.removeAttribute('disabled');
        getModal.surnameInput.removeAttribute('disabled');
        errorWrap.classList.add('modal__error', 'error');
        getModal.controlBtnsWrap.classList.add('modal__submit-wrap_error')
        getModal.submitBtn.classList.add('modal__submit_invalid');

        getModal.controlBtnsWrap.prepend(errorWrap);
      }
    };

    function deleteClientModal(client, clientRow) {
      const modalDelete = document.createElement('div');
      const deleteForm = document.createElement('form');
      const deleteLabel = document.createElement('label');
      const deleteTitle = document.createElement('h3');
      const confirmText = document.createElement('p');
      const controlBtnsWrap = document.createElement('div');
      const deleteBtn = document.createElement('button');
      const closeBtn = document.createElement('button');
      const cancelBtn = document.createElement('button');

      modalDelete.classList.add('modal');
      deleteForm.classList.add('modal__form');
      deleteLabel.classList.add('modal__label');
      deleteTitle.classList.add('modal__title');
      confirmText.classList.add('modal__confirm');
      controlBtnsWrap.classList.add('modal__submit-wrap');
      deleteBtn.classList.add('modal__submit');
      cancelBtn.classList.add('modal__cancel');
      closeBtn.classList.add('modal__close');

      deleteBtn.setAttribute('type', 'button');
      cancelBtn.setAttribute('type', 'button');
      closeBtn.setAttribute('type', 'button');

      deleteTitle.textContent = 'Удалить клиента';
      confirmText.textContent = 'Вы действительно хотите удалить данного клиента?';
      deleteBtn.textContent = 'Удалить';
      cancelBtn.textContent = 'Отмена';

      controlBtnsWrap.append(deleteBtn, cancelBtn);
      deleteLabel.append(deleteTitle, confirmText, closeBtn);
      deleteForm.append(deleteLabel, controlBtnsWrap);
      modalDelete.append(deleteForm);

      deleteBtn.addEventListener('click', () => {
        onDelete(client, clientRow, modalDelete);
      })
      cancelBtn.addEventListener('click', () => {
        onClose(modalDelete);
      });
      closeBtn.addEventListener('click', () => {
        onClose(modalDelete);
      });

      container.append(modalDelete);
      return modalDelete;
    };

    function createLoadingBaner() {
      let oldTable = getTable.table.querySelector('tbody');
      if (oldTable) {
        oldTable.remove();
      }
      const loadBaner = document.createElement('div');
      const loader = document.createElement('div');

      loadBaner.classList.add('loader-wrap');
      loader.classList.add('loader');
      loadBaner.append(loader);
      // getTable.table.append(loadBaner);
      return loadBaner;
    };

    async function fillTable() {
      // Ожидает ответа от сервера
      // с готовой информацией строит таблицу
      // т-боди
      // каждый клиент
      // пуск функции фультрации, действий, формы поска
      // удаляем старую таблицу перед отрисовкой новой

      const loadingAnim = createLoadingBaner();
      getTable.table.append(loadingAnim);

      // специальная задержка для тестирования анимации
      // await new Promise((resolve, reject) => setTimeout(resolve, 3000));

      const response = await fetch('http://localhost:3000/api/clients');
      const ifSuccess = response.status;
      if (ifSuccess == 200) {
        loadingAnim.remove()
        const data = await response.json();

        currentList = data.slice();
        currentList = currentList.sort((a, b) => {
          let x = a.id;
          let y = b.id;
          if (x > y) {return 1};
          if (x < y) {return -1};
          return 0;
        });

        const filters = document.querySelectorAll('.table__head_clickable')
        filters.forEach((filter) => {
          filter.classList.remove('active')
        })

        getTable.id.classList.add('active');
        createClientsInfo(currentList);
      }
    };

    function createClientsInfo(currentList) {
      // удаляем старую таблицу перед отрисовкой новой
      let oldTable = getTable.table.querySelector('tbody');
      if (oldTable) {
        oldTable.remove();
      }
      // рисуем новую таблицу
      let newBody = document.createElement('tbody');
      currentList.forEach( el => {
        let tableRow = document.createElement('tr');
        let id = document.createElement('td');
        let fullName = document.createElement('td');
        let timeCreate = document.createElement('td');
        let timeLastChange = document.createElement('td');
        let contacts = document.createElement('td');
        let actions = document.createElement('td');
        // заполняем ID клиента
        id.textContent = el.id;
        // заполняем Ф И О
        fullName.textContent = el.surname + ' ' + el.name + ' ' + el.lastName;
        fullName.id = el.id;
        // заполняем Дату создания клиента
        let create = new Date(el.createdAt);
        let createDate = document.createElement('span');
        let createTime = document.createElement('span');
        createDate.classList.add('date-info');
        createTime.classList.add('date-info');
        createDate.textContent = create.toLocaleDateString();
        createTime.textContent = create.toTimeString().split(':').slice(0, 2).join(':');
        timeCreate.append(createDate, createTime);
        // заполняем Дату последнего изменения клиента
        let update = new Date(el.updatedAt);
        let updateTime = document.createElement('span');
        let updateDate = document.createElement('span');
        updateDate.classList.add('date-info');
        updateTime.classList.add('date-info');
        updateDate.textContent = update.toLocaleDateString();
        updateTime.textContent = update.toTimeString().split(':').slice(0, 2).join(':');
        timeLastChange.append(updateDate, updateTime);
        // заполняем контакты
        function createContacts() {
          let contactsList = document.createElement('ul')
          contactsList.classList.add('contacts__list')
          el.contacts.forEach( e => {
            let listItem = document.createElement('li');
            listItem.classList.add('contacts__item');
            let contact = document.createElement('button');
            contact.classList.add('contacts__btn');
            tippy(".contacts__btn", {
              interactive: true,
              trigger: 'click',
            });
            // таргетируем картинку
            if (e.type === 'Телефон' || e.type === 'Email' || e.type === 'Facebook' || e.type === 'VK') {
              // тултип с информацией о контакте.
              contact.dataset.tippyContent = `${e.type}: ${e.value}`;
              // добавняем картинку
              let contactImg = document.createElement('img');
              contactImg.src = `img/${e.type}.svg`;
              contact.append(contactImg);
              listItem.append(contact);
              contactsList.append(listItem);
            }
            else {
              // тултип с информацией о контакте.
              contact.dataset.tippyContent = `${e.type}: ${e.value}`;
              contact.ariaExpanded;
              // добавняем картинку
              let contactImg = document.createElement('img');
              contactImg.src = `img/Other.svg`;
              contact.append(contactImg);
              listItem.append(contact);
              contactsList.append(listItem);
            }
          });
          contacts.append(contactsList);
        };
        createContacts();
        //кнопки удалить изменить
        let actionsList = document.createElement('ul');
        let actionsItemDel = document.createElement('li');
        let actionsItemChenge = document.createElement('li');
        let deleteBtn = document.createElement('button');
        let changeBtn = document.createElement('button');

        actionsList.classList.add('actions');
        actionsItemDel.classList.add('actions__item');
        actionsItemChenge.classList.add('actions__item');
        deleteBtn.classList.add('actions__item-del');
        changeBtn.classList.add('actions__item-change');

        deleteBtn.textContent = 'Удалить';
        changeBtn.textContent = 'Изменить';
        // добавляем обработчики на кнопки удалить изменить

        actionsItemChenge.addEventListener('click', async () => {
          changeBtn.classList.add('actions__item-change_load');
          const respClientInfo = await currentClientInfo(el.id);
          changeBtn.classList.remove('actions__item-change_load');
          createClientModal(respClientInfo, tableRow, { onSave, onClose });
        })
        actionsItemDel.addEventListener('click', () => {
          // confirm form
          deleteClientModal(el, tableRow);
        })
        actionsItemChenge.append(changeBtn);
        actionsItemDel.append(deleteBtn);
        actionsList.append(actionsItemChenge, actionsItemDel);

        actions.append(actionsList);
        // собираем информацию о клиенте
        tableRow.append(id, fullName, timeCreate, timeLastChange, contacts, actions);
        newBody.append(tableRow);
        getTable.table.append(newBody);
      })
      // подключаем тултипы для контактов
      tippy(".contacts__btn", {
        interactive: true,
        trigger: 'click',
      });
    };
    fillTable()
    function tableSorts() {
      let id = getTable.id;
      let name = getTable.fullName;
      let timeCreate = getTable.timeCreate;
      let timeChange = getTable.timeLastChange;
      // для анимац и стрелочек
      const filters = document.querySelectorAll('.table__head_clickable');
      filters.forEach((filter) => {
        filter.addEventListener('click', () => {
          if (filter.classList.contains('active')) {
            filters.forEach( (filter) => {
              filter.classList.remove('active');
            });
          }
          else {
            filters.forEach( (filter) => {
              filter.classList.remove('active');
            })
            filter.classList.add('active');
          };
        });
      });
      // сортировка по ID
      id.addEventListener('click', () => {
        currentList = currentList.sort((a, b) => {
          let x = a.id;
          let y = b.id;
          if (!id.classList.contains('active')) {
            if (x > y) {return -1};
            if (x < y) {return 1};
            return 0;
          }
          else {
            if (x > y) {return 1};
            if (x < y) {return -1};
            return 0;
          };
        });
        createClientsInfo(currentList);
      });
      // сортировка по ФИО
      name.addEventListener('click', () => {
        currentList = currentList.sort((a, b) => {
          let x = (a.surname + a.name + a.lastName).toLowerCase();
          let y = (b.surname + b.name + b.lastName).toLowerCase();
          if (name.classList.contains('active')) {
            if (x > y) {return 1};
            if (x < y) {return -1};
            return 0;
          }
          else {
            if (x > y) {return -1};
            if (x < y) {return 1};
            return 0;
          };
        });
        createClientsInfo(currentList);
      });
      // сортировка по TimeCreate
      timeCreate.addEventListener('click', () => {
        currentList = currentList.sort((a, b) => {
          let x = new Date(a.createdAt).getTime();
          let y = new Date(b.createdAt).getTime();
          if (timeCreate.classList.contains('active')) {
            if (x > y) {return 1};
            if (x < y) {return -1};
            return 0;
          }
          else {
            if (x > y) {return -1};
            if (x < y) {return 1};
            return 0;
          };
        });
        createClientsInfo(currentList);
      });
      // сортировка по TimeChange
      timeChange.addEventListener('click', () => {
        currentList = currentList.sort((a, b) => {
          let x = new Date(a.updatedAt).getTime();
          let y = new Date(b.updatedAt).getTime();
          if (timeChange.classList.contains('active')) {
            if (x > y) {return 1};
            if (x < y) {return -1};
            return 0;
          }
          else {
            flag = 0;
            if (x > y) {return -1};
            if (x < y) {return 1};
            return 0;
          };
        });
        createClientsInfo(currentList);
      });
    };
    tableSorts();
    function tableSearch() {
      let searchInput = search.input;
      let form = search.searchForm;
      let timeOut;
      const closeBtn = getCloseBtn()
      form.append(closeBtn);
      form.addEventListener('submit', function(stop) {
        stop.preventDefault();
      });
      // запрос поисковой уходит на вервер, возвращаемый массив клиентов отрисовывается,
      // если поле запросо пустое - запрашиваем с сервера полный список клиентов и отрисовываем его
      searchInput.addEventListener('input', () => {
        mainBody.classList.add('stop-scroll')
        let oldForm = form.querySelector('.search__results-wrap');
        closeBtn.classList.remove('hidden')
        if (searchInput.value == '') {
          closeBtn.classList.add('hidden')
        }
        closeBtn.addEventListener('click', () => {
          searchInput.value = '';
          mainBody.classList.remove('stop-scroll')
          let oldForm = form.querySelector('.search__results-wrap');
          closeBtn.classList.add('hidden')
          if (oldForm) {
            oldForm.remove();
          };
        })
        if (oldForm) {
          oldForm.remove();
        };
        const oldTargets = document.querySelectorAll('.search-target');
        oldTargets.forEach( target => {target.classList.remove('search-target')});
        const searchResults = createSearchList();
        form.append(searchResults.searchWrap);

        clearInterval(timeOut);
        timeOut = setTimeout( async () => {
          if (searchInput.value.trim() !== '') {
            searchInput.classList.add('search__result_navi');
            // запрашиваем на с сервера данные по поисковому запросу
            const searchReq = await startSrarchRequest(searchInput);
            // строим поля со ссылками на найденных клиентов
            searchReq.forEach( el => {
              const addResult = addSearchResults(el);
              // по клику на ссылку клиента закрываем поле результатов поиска и скролим к якорю клиента
              addResult.searchItemLink.addEventListener('click', () => {
                searchResults.searchWrap.remove();
                mainBody.classList.remove('stop-scroll')
                const searchTarget = document.getElementById(`${el.id}`);
                searchTarget.classList.add('search-target');
              })
              // добавляем ссылку на клиента в поле результатов поиска
              searchResults.searchList.append(addResult.searchItem);
            })
            // если есть результаты поиска
            searchInput.classList.add('search__result')
            let keyNavi = form.querySelectorAll('.search__result')
            let keyNaviArray = Array.prototype.slice.call(keyNavi);
            if (keyNaviArray.length > 1) {
              let num = keyNaviArray.indexOf(document.querySelector('.search__result_navi'))
              form.addEventListener('keydown', e => {

                if (num >= 0) {
                  if (e.key == 'ArrowDown') {
                    if (num == keyNaviArray.length - 1) {
                      keyNaviArray[num].classList.remove('search__result_navi');
                      num = 0;
                      keyNaviArray[num].classList.add('search__result_navi');
                      keyNaviArray[0].focus();
                    }
                    else {
                      keyNaviArray[++num].classList.add('search__result_navi');
                      keyNaviArray[num].firstChild.focus();
                      keyNaviArray[--num].classList.remove('search__result_navi');
                      num = keyNaviArray.indexOf(document.querySelector('.search__result_navi'))
                    }
                  }
                  if (e.key == 'ArrowUp') {
                    if (num == 0) {
                      keyNaviArray[num].classList.remove('search__result_navi');
                      num = keyNaviArray.length - 1;
                      keyNaviArray[num].classList.add('search__result_navi');
                      keyNaviArray[num].firstChild.focus();
                    }
                    else if (num == 1) {
                        keyNaviArray[num].classList.remove('search__result_navi');
                        keyNaviArray[--num].classList.add('search__result_navi');
                        keyNaviArray[num].focus();
                      }
                      else {
                      keyNaviArray[--num].classList.add('search__result_navi');
                      keyNaviArray[num].firstChild.focus();
                      keyNaviArray[++num].classList.remove('search__result_navi');
                      num = keyNaviArray.indexOf(document.querySelector('.search__result_navi'))
                    }
                  }
                }
              })

            }
            else {
              keyNavi = null
              keyNaviArray = null
            }
          }
          else {
            // создать общую функцию для получения с сервера информации о всех клиентах
            const oldTargets = document.querySelectorAll('.search-target');
            oldTargets.forEach( target => {target.classList.remove('search-target')});
            const response = await fetch('http://localhost:3000/api/clients');
            const data = await response.json();
            currentList = data.slice();
            createClientsInfo(currentList);
          }
        }, 300);
      });

      async function startSrarchRequest(data) {
        const searchResponse = await fetch(`http://localhost:3000/api/clients?search=${data.value}`);
        const searchData = await searchResponse.json();
        return searchData;
      }

      function getCloseBtn() {
        const closeBtn = document.createElement('button');
        closeBtn.classList.add('clients__search-reset', 'hidden');
        closeBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0"/>
        </svg>`;
        return closeBtn;
      }

      function createSearchList() {
        const searchWrap = document.createElement('div');
        const searchList = document.createElement('ul');
        searchWrap.classList.add('search__results-wrap');
        searchList.classList.add('search__results');
        searchList.setAttribute('tabindex', '0');
        searchWrap.append(searchList);
        return {
          searchWrap,
          searchList,
        }
      }
      function addSearchResults(searchData = null) {
        if (searchData) {
          const searchItem = document.createElement('li');
          const searchItemLink = document.createElement('a');

          searchItem.classList.add('search__result');
          searchItemLink.classList.add('search__link');
          searchItemLink.textContent = `${searchData.surname} ${searchData.name} ${searchData.lastName}`;
          searchItemLink.href = `#${searchData.id}`;
          searchItemLink.setAttribute('tabindex', '-1');

          searchItem.append(searchItemLink);
          return {
            searchItem,
            searchItemLink,
          }
        }
      }
    };
    tableSearch();
  };

  createApp();
})()

