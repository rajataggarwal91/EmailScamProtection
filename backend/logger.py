import logging

logger = logging.getLogger(__name__)  # Creates a logger with the module's name

# Set up logger
def setup_logger():
    logger.setLevel(logging.DEBUG)  # Set the level of logging (DEBUG, INFO, WARNING, etc.)
    
    # Create a file handler to log to a file
    file_handler = logging.FileHandler('application.log')
    file_handler.setLevel(logging.DEBUG)  # Log all messages at DEBUG level and higher
    
    # Create a stream handler to log to the console
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG)  # Log all messages at DEBUG level and higher
    
    # Create a formatter that includes time, filename, and line number
    formatter = logging.Formatter('%(asctime)s - %(filename)s - Line %(lineno)d - %(levelname)s: %(message)s')
    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)
    
    # Add the handlers to the logger
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger

def getLogger():
    return logger