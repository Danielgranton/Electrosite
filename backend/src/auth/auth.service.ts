import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) {}

    async register(name: string, email: string, password: string) {
        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword =  await bcrypt.hash(password, 10);

        const user = await this.userService.create({
            name,
            email,
            password: hashedPassword,
        });

        const payload = { sub: user.id, email: user.email };
        const token = this.jwtService.sign(payload);
        const { password: _password, ...safeUser } = user;

        return {
            message: 'User registered successfully',
            access_token: token,
            user: safeUser,
        };
    }


    async login(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, email: user.email };
        const token = this.jwtService.sign(payload);
        const { password: _password, ...safeUser } = user;

        return {
            access_token: token,
            user: safeUser,
        };
    }
}
