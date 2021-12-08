export class FormVirtualDOM {
  constructor(data, mountEl) {
    this.data = data;
    this.mountEl = mountEl;
  }

  errorsRender = async (fieldName) => {
    this.data[fieldName].errors.element.innerHTML = '';
    this.data[fieldName].errors.value.forEach(error => {
      const errorDiv = document.createElement('div');
      errorDiv.classList.add('form-errors-item');
      errorDiv.innerText = error;

      this.data[fieldName].errors.element.appendChild(errorDiv);
    });
  }

  validateField = async (fieldName) => {
    let validateStatus = true;
    this.data[fieldName].errors.value = [];

    if (!this.data[fieldName].value.value) {
      this.data[fieldName].errors.value.push('Поле не заполнено');
      validateStatus = false;
    }

    return validateStatus;
  }

  domUpdate = async () => {
    for (const [key, field] of Object.entries(this.data)) {
      this.data[key].value.element.value = this.data[key].value.value;
    }
  }

  dataReset = async () => {
    for (const [key, field] of Object.entries(this.data)) {
      this.data[key].value.value = null;
    }
  }

  dataUpdate = async (e) => {
    const fieldName = e.target.getAttribute('about');

    if (fieldName) {
      this.data[fieldName].value.value = this.data[fieldName].value.element?.value;
      this.data[fieldName].errors.value = [];
      this.data[fieldName].errors.element.innerHTML = '';

      const validateStatus = await this.validateField(fieldName);

      if (!validateStatus) {
        await this.errorsRender(fieldName);
      }
    }
  }

  dataSetUp = async () => {
    const formDom = document.querySelector(this.mountEl).children;


    for(const item of formDom) {
      const fieldName = item.getAttribute('about');
      if (fieldName) {
        this.data[fieldName].value.value = item.children[1]?.value;
        this.data[fieldName].value.element = item.children[1];

        this.data[fieldName].errors.value = [];
        this.data[fieldName].errors.element = item.children[2];
        this.data[fieldName].errors.element.innerHTML = '';

        this.data[fieldName].value.element.addEventListener('input', async (e) => {
          await this.dataUpdate(e);
        });
      }
    }
  }

  getForm = async () => {
    const form = new FormData;
    let validateStatus = true;

    for (const [key, field] of Object.entries(this.data)) {
      const validateFieldStatus = await this.validateField(key);
      if (!validateFieldStatus) {
        validateStatus = false;
        await this.errorsRender(key);
      }
    }

    if (validateStatus) {
      for (const [key, field] of Object.entries(this.data)) {
        if (field.value.element.type === 'file') {
          // if (typeof field.value.value !== 'string') {
          //
          // } else {
          //
          // }
          form.append(key, field.value.element.files[0]);
        } else {
          form.append(key, field.value.value);
        }

      }
      return form;
    } else {
      return null;
    }
  }

  setForm = async (data) => {

    console.log(data)

    for (const [key, field] of Object.entries(this.data)) {
      if (data[key] ) {
        this.data[key].value.value = data[key];
      }
    }

    if (data['author']) {
      this.data['authorId'].value.value = data['author'].authorId
    }

    if (data['image']) {
      const url = `data:image/jpg;base64,${data['image']}`;
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const fileList = new DataTransfer();
          const file = new File([blob], "иходная картина загружена",{ type: "image/jpg" });
          fileList.items.add(file);
          this.data['file'].value.value = 'base64'
          this.data['file'].value.element.files = fileList.files;
        })
    }

    await this.domUpdate()
  }
}