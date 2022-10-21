import IProject from '../Project/IProject';

export default interface INewTask {
    description: string,
    timeInSeconds: number,
    project: IProject,
}