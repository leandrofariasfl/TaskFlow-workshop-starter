import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import type { Task } from "../types/task";

type TaskItemProps = {
  task: Task;
  onToggleTask: (id: string) => void;
  onEditTask: (id: string, title: string) => void;
  onDeleteTask: (id: string) => void;
};

export function TaskItem({ task, onToggleTask, onEditTask, onDeleteTask }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputId = useId();

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  function startEditing(): void {
    setDraftTitle(task.title);
    setIsEditing(true);
  }

  function cancelEditing(): void {
    setDraftTitle(task.title);
    setIsEditing(false);
  }

  function saveEditing(): void {
    const trimmedTitle = draftTitle.trim();

    if (trimmedTitle === "") {
      return;
    }

    onEditTask(task.id, trimmedTitle);
    setIsEditing(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    saveEditing();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Escape") {
      event.preventDefault();
      cancelEditing();
    }
  }

  return (
    <li className={task.completed ? "task-item task-item--completed" : "task-item"}>
      {isEditing ? (
        <form className="task-item__edit-form" onSubmit={handleSubmit}>
          <label className="task-item__label" htmlFor={editInputId}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => {
                onToggleTask(task.id);
              }}
            />
            <input
              ref={inputRef}
              id={editInputId}
              className="task-item__edit-input"
              type="text"
              value={draftTitle}
              aria-label={`Título da tarefa ${task.title}`}
              onChange={(event) => {
                setDraftTitle(event.target.value);
              }}
              onKeyDown={handleKeyDown}
            />
          </label>
          <div className="task-item__actions">
            <button type="submit" className="task-item__edit">
              Salvar
            </button>
            <button type="button" className="task-item__cancel" onClick={cancelEditing}>
              Cancelar
            </button>
            <button
              type="button"
              className="task-item__delete"
              aria-label={`Excluir tarefa ${task.title}`}
              onClick={() => {
                onDeleteTask(task.id);
              }}
            >
              Excluir
            </button>
          </div>
        </form>
      ) : (
        <>
          <label className="task-item__label">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => {
                onToggleTask(task.id);
              }}
            />
            <span>{task.title}</span>
          </label>
          <div className="task-item__actions">
            <button
              type="button"
              className="task-item__edit"
              aria-label={`Editar tarefa ${task.title}`}
              onClick={startEditing}
            >
              Editar
            </button>
            <button
              type="button"
              className="task-item__delete"
              aria-label={`Excluir tarefa ${task.title}`}
              onClick={() => {
                onDeleteTask(task.id);
              }}
            >
              Excluir
            </button>
          </div>
        </>
      )}
    </li>
  );
}
