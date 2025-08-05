export function handleAuthError(response, setToast, navigate) {
  if (response.status === 403) {
    setToast({
      visible: true,
      message: 'Sessão inválida ou expirada. Faça login novamente.',
      status: 'ERROR',
    });

    setTimeout(() => {
      localStorage.clear();
      navigate('/login');
    }, 2000);

    return true; 
  }
  return false;
}
