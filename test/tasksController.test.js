const { getAllTasks, getTaskById, createTask, updateTask, deleteTask } = require('../controllers/tasksController');
const taskModel = require('../models/task');

jest.mock('../models/task'); 

describe('Task Controller', () => {
    let req, res;
    let consoleErrorMock;

    beforeEach(() => {
        req = { params: {}, query: {}, body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
        consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {}); 
    });

    afterEach(() => {
        consoleErrorMock.mockRestore(); 
    });

    describe('getAllTasks', () => {
        test('should return tasks with pagination', async () => {
            req.query = { page: '1', limit: '10' };
            const mockTasks = [{ id: '1', title: 'Task 1' }, { id: '2', title: 'Task 2' }];
            
            taskModel.getAllTasks.mockResolvedValue(mockTasks);

            await getAllTasks(req, res);

            expect(taskModel.getAllTasks).toHaveBeenCalledWith(1, 10);
            expect(res.json).toHaveBeenCalledWith(mockTasks);
        });

        test('should return 500 if fetching tasks fails', async () => {
            taskModel.getAllTasks.mockRejectedValue(new Error('Database error'));

            await getAllTasks(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
        });
    });

    describe('getTaskById', () => {
        test('should return a task if found', async () => {
            req.params.id = '1';
            const mockTask = { id: '1', title: 'Task 1' };

            taskModel.getTaskById.mockResolvedValue(mockTask);

            await getTaskById(req, res);

            expect(taskModel.getTaskById).toHaveBeenCalledWith('1');
            expect(res.json).toHaveBeenCalledWith(mockTask);
        });

        test('should return 404 if task is not found', async () => {
            req.params.id = '1';
            taskModel.getTaskById.mockResolvedValue(null);

            await getTaskById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
        });

        test('should return 500 if fetching task fails', async () => {
            taskModel.getTaskById.mockRejectedValue(new Error('Database error'));

            await getTaskById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
        });
    });

    describe('createTask', () => {
        test('should create a task and return it', async () => {
            req.body = { title: 'New Task', description: 'Task description', status: 'pending' };
            const mockTask = { id: '1', ...req.body };

            taskModel.createTask.mockResolvedValue(mockTask);

            await createTask(req, res);

            expect(taskModel.createTask).toHaveBeenCalledWith('New Task', 'Task description', 'pending');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockTask);
        });

        test('should return 400 if required fields are missing', async () => {
            req.body = { title: 'New Task', description: 'Task description' };

            await createTask(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
        });

        test('should return 500 if task creation fails', async () => {
            req.body = { title: 'New Task', description: 'Task description', status: 'pending' };
            taskModel.createTask.mockRejectedValue(new Error('Database error'));

            await createTask(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
        });
    });

    describe('updateTask', () => {
        test('should update a task if found', async () => {
            req.params.id = '1';
            req.body = { title: 'Updated Task', description: 'Updated description', status: 'completed' };
            const mockUpdatedTask = { id: '1', ...req.body };

            taskModel.updateTask.mockResolvedValue(mockUpdatedTask);

            await updateTask(req, res);

            expect(taskModel.updateTask).toHaveBeenCalledWith('1', 'Updated Task', 'Updated description', 'completed');
            expect(res.json).toHaveBeenCalledWith(mockUpdatedTask);
        });

        test('should return 404 if task is not found', async () => {
            req.params.id = '1';
            req.body = { title: 'Updated Task', description: 'Updated description', status: 'completed' };

            taskModel.updateTask.mockResolvedValue(null);

            await updateTask(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
        });

        test('should return 500 if updating task fails', async () => {
            req.params.id = '1';
            req.body = { title: 'Updated Task', description: 'Updated description', status: 'completed' };

            taskModel.updateTask.mockRejectedValue(new Error('Database error'));

            await updateTask(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
        });
    });

    describe('deleteTask', () => {
        test('should delete a task if found', async () => {
            req.params.id = '1';
            taskModel.deleteTask.mockResolvedValue(true);

            await deleteTask(req, res);

            expect(taskModel.deleteTask).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        test('should return 404 if task is not found', async () => {
            req.params.id = '1';
            taskModel.deleteTask.mockResolvedValue(null);

            await deleteTask(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Task not found' });
        });

        test('should return 500 if deleting task fails', async () => {
            req.params.id = '1';
            taskModel.deleteTask.mockRejectedValue(new Error('Database error'));

            await deleteTask(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
        });
    });
});
