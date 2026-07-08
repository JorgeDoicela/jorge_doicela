export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(entityName: string, identifier?: string | number) {
    const detail = identifier ? ` con identificador ${identifier}` : '';
    super(`${entityName}${detail} no fue encontrado.`);
  }
}

export class EntityConflictError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
