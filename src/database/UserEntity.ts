import { AutoIncrement, PrimaryKey, Table } from "./IDatabase.js";

@Table('users', `
    id INT AUTO_INCREMENT,
    avatar VARCHAR(256),
    name VARCHAR(16),
    PRIMARY KEY (id)
`)
@PrimaryKey("id")
@AutoIncrement("id")
export class UserEntity {
    public id: number = 0;
    public avatar: string = "";
    public name: string = "";

    public static create(name: string, avatar: string): UserEntity {
        const user = new UserEntity();
        user.avatar = avatar;
        user.name = name;
        return user;
    }
}