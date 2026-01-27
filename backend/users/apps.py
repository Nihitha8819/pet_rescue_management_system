from django.apps import AppConfig


class UsersConfig(AppConfig):
    name = "users"

    def ready(self) -> None:
        # Import signal handlers
        from . import signals  # noqa: F401
        return super().ready()
