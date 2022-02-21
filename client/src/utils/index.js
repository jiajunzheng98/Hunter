
export function getRedirectTo (type, avatar) {
  let path

  if (type === 'employer') {
    path = '/employer'
  } else {
    path = '/candidate'
  }

  if (!avatar) {
    path += 'info';
  }

  return path;
}