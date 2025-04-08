import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;
  let mockAppService: Partial<AppService>;

  beforeEach(() => {
    mockAppService = {
      getHello: jest.fn().mockReturnValue({ message: 'App is running' }),
    };

    controller = new AppController(mockAppService as AppService);
  });

  describe('getHello', () => {
    it('should return a message indicating the app is running', () => {
      const result = controller.getHello();

      expect(mockAppService.getHello).toHaveBeenCalled();
      expect(result).toEqual({ message: 'App is running' });
    });
  });
});
