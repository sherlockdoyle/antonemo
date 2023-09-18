export default function handleTheme(isLightTheme: boolean) {
  if (isLightTheme) document.body.dataset.theme = 'light';
  else document.body.dataset.theme = 'dark';
}
