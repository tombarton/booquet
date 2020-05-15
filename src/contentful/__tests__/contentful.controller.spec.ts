import { Test, TestingModule } from '@nestjs/testing';
import { ContentfulController } from '../contentful.controller';
import { ContentfulService } from '../contentful.service';
import { ContentfulGuard } from '../contentful.guard';

class ContentfulServiceMock {
  updateProducts() {
    return Promise.resolve();
  }
}

describe('ContentfulController', () => {
  let contentfulController: ContentfulController;

  const mockedContentfulService = {
    provide: ContentfulService,
    useClass: ContentfulServiceMock,
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ContentfulController],
      providers: [mockedContentfulService],
    })
      .overrideGuard(ContentfulGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    contentfulController = app.get<ContentfulController>(ContentfulController);
  });

  describe('update-products', () => {
    it('should return "OK"', () => {
      expect(contentfulController.updateProducts()).toBe('OK');
    });
  });
});
