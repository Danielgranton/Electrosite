import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return {
            message: 'proteted route',
            user: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
            }
        };
    }
}
