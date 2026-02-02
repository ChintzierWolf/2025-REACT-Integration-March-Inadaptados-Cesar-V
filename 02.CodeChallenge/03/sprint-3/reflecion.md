- Escribe 2–3 frases en tu README: ¿qué diferencia viste entre estado volátil y localStorage?
  La diferencia entre estado volátil y localStorage es que el estado volátil se pierde al recargar la página, mientras que localStorage se mantiene incluso después de recargar.
  Podemos decir que localStorage es una forma de persistir datos en el navegador. Mientras que el estado volátil se pierde al recargar la página, localStorage se mantiene incluso después de recargar.

- ¿Qué pasó cuando recargaste sin el sello?
  Al recargar la página sin el sello, el usuario se encontraba en el formulario de login, ya que el estado isAuth estaba en false.
  De caso contrario, si el usuario tenía el sello, se encontraba en el contenido especial.
