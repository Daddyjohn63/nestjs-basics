import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  //we add a waterfall of routes

  @Get() //GET users or /users?role=value
  findAll(@Query('role') role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    return [];
  }

  //make sure dynamic routes are added last
  @Get(':id') //GET /users/:id
  findOne(@Param('id') id: string) {
    return { id };
  }

  @Post() //POST user
  create(@Body() user: {}) {
    return user;
  }

  @Patch(':id') //PATCH /users/:id
  update(@Param('id') id: string, @Body() userUpdate: {}) {
    return { id, ...userUpdate };
  }

  @Delete(':id') //DELETE /users/:id
  delete(@Param('id') id: string) {
    return { id };
  }
}
