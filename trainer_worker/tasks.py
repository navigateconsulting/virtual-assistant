from celery import Celery
from celery.utils.log import get_task_logger
import os
import rasa

logger = get_task_logger(__name__)

app = Celery('tasks', broker='redis://redis:6379/0', backend='redis://redis:6379/0')


@app.task()
def train_model(project_id):
    logger.info("Starting Training for Project ID " + str(project_id))
    result = os.listdir('/rasa_projects/'+str(project_id))
    logger.info(str(result))

    base_path = '/rasa_projects/'+str(project_id)+'/'

    logger.info("Training Rasa Model ")

    model_path = rasa.train(domain= base_path+'domain.yml',
                            config=base_path+'config.yml',
                            training_files=base_path+'data/',
                            output=base_path+'models/')

    logger.info("Model Path " + str(model_path))

    return model_path
