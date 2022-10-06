FROM python:3.8

WORKDIR /app
COPY requirements.txt /app
RUN pip install -r requirements.txt

COPY . .

ENV FLASK_ENV=development

ENTRYPOINT [ "python" ]

CMD [ "flask_app.py" ]