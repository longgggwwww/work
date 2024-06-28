import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { DemoService } from './demo.service';
import { CreateDemoDto } from './dto/create-demo.dto';
import { UpdateDemoDto } from './dto/update-demo.dto';

@WebSocketGateway()
export class DemoGateway {
  constructor(private readonly demoService: DemoService) {}

  @SubscribeMessage('createDemo')
  create(@MessageBody() createDemoDto: CreateDemoDto) {
    return this.demoService.create(createDemoDto);
  }

  @SubscribeMessage('findAllDemo')
  findAll() {
    return this.demoService.findAll();
  }

  @SubscribeMessage('findOneDemo')
  findOne(@MessageBody() id: number) {
    return this.demoService.findOne(id);
  }

  @SubscribeMessage('updateDemo')
  update(@MessageBody() updateDemoDto: UpdateDemoDto) {
    return this.demoService.update(updateDemoDto.id, updateDemoDto);
  }

  @SubscribeMessage('removeDemo')
  remove(@MessageBody() id: number) {
    return this.demoService.remove(id);
  }
}
