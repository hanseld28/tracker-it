import IProject from '../Project/IProject';

export default interface ITask {
    id: number,
    description: string,
    timeInSeconds: number,
    project: IProject,
}