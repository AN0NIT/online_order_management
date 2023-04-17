#!/bin/bash

echo [ WINDOWS PYTHON3 ] Running ...
cmd.exe /c python manage.py makemigrations &&
cmd.exe /c python manage.py migrate --run-syncdb &&
cmd.exe /c python manage.py runserver
