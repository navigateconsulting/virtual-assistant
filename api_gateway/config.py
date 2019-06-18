from configparser import ConfigParser
import os

DEFAULT_CONFIG_FILE = 'config.ini'


def get_config_file():
    return os.environ.get('CONFIG_FILE', DEFAULT_CONFIG_FILE)


CONFIG_FILE = get_config_file()


def create_config(config_file=None):
    parser = ConfigParser()
    parser.read(config_file or CONFIG_FILE)
    return parser


CONFIG = create_config()
