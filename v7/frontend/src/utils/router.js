import PublicView from '../views/PublicView';
import PaintingsView from '../views/Paintings/PaintingsView';
import PaintingsCreate from "../views/Paintings/PaintingsCreate";
import PaintingsEdit from "../views/Paintings/PaintingsEdit";
import LoginView from '../views/LoginView';
import RegView from '../views/RegView';
import ForbiddenView from '../views/ForbiddenView';
import TextView from "../views/TextView";
import FilesView from "../views/FilesView";
import NotFoundView from "../views/NotFoundView";

const tgApp = document.querySelector('#app');

const pathToRegex = path => new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$');

const getParams = match => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

  return Object.fromEntries(keys.map((key, i) => {
    return [key, values[i]];
  }));
};

export const navigateTo = async url => {
  history.pushState(null, null, url);

  if (url !== location.href || !location.hash) {
    await router();
  } else {
    const element = document.querySelector(location.hash)

    if (element) {
      const topPos = element.getBoundingClientRect().top + window.pageYOffset

      window.scroll({
        top: topPos - 70,
        behavior: 'smooth'
      });
    }
  }
};

const router = async () => {
  const routes = [
    { path: '/404', view: NotFoundView, permission: ['guest', 'user'] },
    { path: '/', view: PublicView, permission: ['guest'] },
    { path: '/paintings', view: PaintingsView, permission: ['user'] },
    { path: '/paintings/create', view: PaintingsCreate, permission: ['user'] },
    { path: '/paintings/edit', view: PaintingsEdit, permission: ['user'] },
    { path: '/login', view: LoginView, permission: ['guest'] },
    { path: '/reg', view: RegView, permission: ['guest'] },
    { path: '/text', view: TextView, permission: ['guest', 'user'] },
    { path: '/files', view: FilesView, permission: ['user'] },
  ];


  const potentialMatches = routes.map(route => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path))
    };
  });

  let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

  if (!match) {
    match = {
      route: routes[0],
      result: [location.pathname]
    };
  }

  if (await permissionCheck(match.route.permission)) {
    const view = new match.route.view(getParams(match));

    tgApp.innerHTML = await view.getHtml();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
    await view.onMounted();
  }
};

const permissionCheck = async (permission) => {
  const userTokenCheck = localStorage.getItem('token');

  if (userTokenCheck) {
    if (permission.find(item => item === 'guest') && !permission.find(item => item === 'user')) {
      await navigateTo('/paintings');
      return false;
    }
  } else {
    if (permission.find(item => item === 'user')) {
      const view = new ForbiddenView;

      tgApp.innerHTML = await view.getHtml();
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });

      await view.onMounted();
      return false;
    }
  }

  return true;
}

window.addEventListener('popstate', router);

document.addEventListener('DOMContentLoaded', async () => {
  document.body.addEventListener('click', async e => {
    let element = null;

    element = e.composedPath().find(item => item.tagName === 'A');

    if (element && element.matches('[data-link]')) {
      e.preventDefault();

      await navigateTo(element.href);
    }
  });

  await router();
});