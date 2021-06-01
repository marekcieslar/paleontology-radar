import './style.scss';

import faunadb from 'faunadb';

declare global {
  interface Window {
    secret: string;
  }
}
interface Element {
  is: string;
}

const q = faunadb.query;
const client = new faunadb.Client({
  secret: window.secret,
});

let int: ReturnType<typeof setInterval>;
let count = 0;

const buttons = {
  wrapper: document.getElementById('wrapper-buttons') as HTMLDivElement,
  bntRadar: document.getElementById('btn-radar') as HTMLButtonElement,
  btnAdmin: document.getElementById('btn-admin') as HTMLButtonElement,
};

const admin = {
  wrapper: document.getElementById('wrapper-admin') as HTMLDivElement,
  btnRadar: document.getElementById('btn-admin-radar') as HTMLButtonElement,
  btnBone: document.getElementById('btn-admin-bone') as HTMLButtonElement,
  btnTeeth: document.getElementById('btn-admin-teeth') as HTMLButtonElement,
};

const image = {
  wrapper: document.getElementById('wrapper-image') as HTMLDivElement,
  img: document.getElementById('image') as HTMLDivElement,
};

const hideElement = (element: HTMLDivElement) => {
  element.classList.add('hide');
};

const showRadar = (element: HTMLDivElement) => {
  element.setAttribute('class', 'image');
  element.classList.add('image--radar');
  element.classList.add('image--rotate');
};

const showBone = (element: HTMLDivElement) => {
  element.setAttribute('class', 'image');
  element.classList.add('image--bone');
  element.classList.add('image--fade-in-out');
};

const showTeeth = (element: HTMLDivElement) => {
  element.setAttribute('class', 'image');
  element.classList.add('image--teeth');
  element.classList.add('image--fade-in-out');
};

const showWrapper = (wrapper: HTMLDivElement) => {
  wrapper.classList.remove('hide');
};

// start RADAR
buttons.bntRadar.addEventListener('click', () => {
  hideElement(buttons.wrapper);
  showRadar(image.img);
  showWrapper(image.wrapper);

  count = 0;
  int = setInterval(() => {
    count++;

    if (count > 600) {
      clearInterval(int);
      showWrapper(buttons.wrapper);
      hideElement(image.wrapper);
      return;
    }

    client
      .query(q.Get(q.Ref(q.Collection('status'), '300186245073469957')))
      .then((res: any) => {
        const { is } = res.data as Element;

        console.log('is', is);

        if (is) {
          switch (is) {
            case 'radar':
              showRadar(image.img);
              break;
            case 'bone':
              showBone(image.img);
              break;
            case 'teeth':
              showTeeth(image.img);
            default:
              break;
          }
        }
      })
      .catch((e) => console.error(e));
  }, 1000);
});

// start ADMIN
buttons.btnAdmin.addEventListener('click', () => {
  hideElement(buttons.wrapper);
  showWrapper(admin.wrapper);
});

admin.btnRadar.addEventListener('click', () => {
  client
    .query(
      q.Update(q.Ref(q.Collection('status'), '300186245073469957'), {
        data: {
          is: 'radar',
        },
      })
    )
    .then((res: any) => {
      console.log('res.data.is', res.data.is);
    })
    .catch((e) => console.error(e));
});
admin.btnBone.addEventListener('click', () => {
  client
    .query(
      q.Update(q.Ref(q.Collection('status'), '300186245073469957'), {
        data: {
          is: 'bone',
        },
      })
    )
    .then((res: any) => {
      console.log('res.data.is', res.data.is);
    })
    .catch((e) => console.error(e));
});
admin.btnTeeth.addEventListener('click', () => {
  client
    .query(
      q.Update(q.Ref(q.Collection('status'), '300186245073469957'), {
        data: {
          is: 'teeth',
        },
      })
    )
    .then((res: any) => {
      console.log('res.data.is', res.data.is);
    })
    .catch((e) => console.error(e));
});
