import { Test, TestingModule } from '@nestjs/testing';
import { JustifyService } from './justify.service';

describe('JustifyService', () => {
  let service: JustifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JustifyService],
    }).compile();

    service = module.get<JustifyService>(JustifyService);
  });

  it('should justify text to a given length', () => {
    const text = 'This is a test text that needs to be justified to 80 characters per line.';
    const justifiedText = service.justifyText(text);

    // Check that the justified text does not exceed 80 characters per line
    const lines = justifiedText.split('\n');
    lines.forEach(line => {
      expect(line.length).toBeLessThanOrEqual(80);
    });
  });

  it('should handle single word lines without justification', () => {
    const line = 'Test';
    const justifiedLine = service['justifyLine'](line, 80);

    expect(justifiedLine).toBe('Test');
  });

  it('should justify a line by adding spaces between words', () => {
    const line = 'This is a test';
    const justifiedLine = service['justifyLine'](line, 20);

    // Check if the line has the correct amount of spaces and matches expected result
    expect(justifiedLine.length).toBe(20);
    expect(justifiedLine).toBe('This   is   a   test'); // Adjusted to reflect the actual behavior
  });

});
