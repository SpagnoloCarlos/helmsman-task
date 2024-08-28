# HelmsmanTask

HelmsmanTask es un clon simple e intuitivo de Jira, diseñado para facilitar la gestión de proyectos y tareas, de uso libre y gratuito. Esta aplicación web es responsive y está construida utilizando tecnologías modernas como Next.js, Tailwind CSS y Shadcn.

<p>
  <img src="https://res.cloudinary.com/doh9z4wqr/image/upload/v1724888138/HelmsmanTask_hvocdd.png" alt="HelmsmanTask" />
</p>

## Características principales

- **Gestión de proyectos**: Crea uno o varios proyectos, cada uno con su propio conjunto de estados personalizados.
- **Estados personalizados**: Define múltiples estados para organizar y agrupar tus tareas dentro de un proyecto.
- **Gestión de tareas**:
  - **Crear tareas**: Añade nuevas tareas dentro de tus proyectos.
  - **Editar tareas**: Modifica los detalles de tus tareas existentes.
  - **Eliminar tareas**: Borra las tareas que ya no son necesarias.
  - **Descripción de tareas**: Añade descripciones detalladas a cada tarea.
- **Drag and Drop**: Reorganiza tareas entre estados fácilmente mediante una interfaz de arrastrar y soltar.
- **Persistencia de datos**: Toda la información es guardada en el local storage del navegador.

## Tecnologías Utilizadas

- **[Next.js](https://nextjs.org/)**: Framework de React que ofrece características como el renderizado del lado del servidor y la generación de sitios estáticos.
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework CSS para un diseño rápido y altamente customizable.
- **[Shadcn](https://ui.shadcn.com/)**: Colección de componentes de UI para Next.js y Tailwind que acelera el desarrollo de interfaces.
- **[@hello-pangea/dnd](https://github.com/hello-pangea/dnd)**: Biblioteca para implementar funcionalidad de arrastrar y soltar (Drag and Drop) en aplicaciones React.

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/SpagnoloCarlos/helmsman-task.git
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd helmsman-task
   ```

3. Instala las dependencias:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

4. Ejecuta la aplicación en modo de desarrollo:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Contribuir

¡Las contribuciones son bienvenidas! Si tienes alguna idea para mejorar HelmsmanTask, abre una Pull Request o informa de un problema en [Issues]("https://github.com/SpagnoloCarlos/helmsman-task/issues").

## Licencia

Este proyecto está licenciado bajo la [MIT license](/LICENSE).
