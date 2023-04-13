import { Command } from "@theia/core";

export function groupCommands(commands: Command[]): Record<string, Command[]> {
        // Group the commands by category
        const categories: Record<string, Command[]> = {};
        commands.forEach((command) => {
            const category = command.category ?? 'Other';
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(command);
        });
        return categories;
}