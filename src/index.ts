import { logger, Indicators, cmdRunner, showError } from './utils/index.js';
import { askQuestions, QuestionAnswer } from './questions/index.js';
import { AppConstant, getTheme } from './constants/index.js';
import path from 'path';
import fs from 'fs-extra';
import gradient from 'gradient-string';
import {
  generateProject,
  generateAssets,
  generateConstants,
  generateComponents,
  generateConfigs,
  generateHooks,
  generateModules,
  generateRedux,
  generateThemes,
  generateTranslations,
  generateUtils,
  generateGraphQl,
  generateSaga,
  generateTypes
} from './scripts/index.js';
import chalk from 'chalk';

export { QuestionAnswer } from './questions/index.js';
export { AppConstant } from './constants/index.js';

export const main = async () => {
  const colors = getTheme();
  const genInd = Indicators.getInstance('General');

  try {
    logger({
      text: `                    #                                                                   
                #####                                                                   
            #########                                                                   
          ############                                                                   
      ##################                                                                
    ########################                                                             
    #############    ##########                                                          
    ##########       ##############                                                      
    #########        #################                                                   
    ############         ##############                                                  
    ###############         ###########                                                  
      ################         ########                                                  
        #############      ###########                                                  
            #########  ###############                                                  
                ######################                                                   
                  ################                                                      
                    ##########                                                          
                    #######                                                             
                    ####                                                                
                    #\n`,
      gradient: gradient(colors.logo)
    });
    logger({
      text: `         Simform Solutions Pvt. Ltd.\n\n`,
      modifiers: chalk.bold,
      gradient: gradient(colors.title, { interpolation: 'hsv', hsvSpin: 'long' })
    });

    const queInd = Indicators.getInstance('Questionnaire');
    await askQuestions(queInd);

    // Create project directories if they don't exist
    const projectPath = path.join(process.cwd(), QuestionAnswer.instance.getProjectName);
    await fs.mkdir(projectPath, { recursive: true });

    // Create app directory if it doesn't exist
    const appPath = path.join(projectPath, 'app');
    await fs.mkdir(appPath, { recursive: true });

    const genProInd = Indicators.getInstance('Project Generate');
    genProInd.start();
    genProInd.changeMessage({
      text: AppConstant.StringConstants.msgProjectTemplate,
      color: colors.task.loading,
      modifiers: chalk.bold
    });
    await generateProject(projectPath, appPath, genProInd);

    await generateAssets(appPath, genProInd);

    await generateComponents(appPath, genProInd);

    await generateConfigs(appPath, genProInd);

    await generateConstants(appPath, genProInd);

    if (QuestionAnswer.instance.isSupportStateManagement(AppConstant.StateManagement.GraphQL)) {
      await generateGraphQl(appPath, genProInd);
    }

    await generateHooks(appPath, genProInd);

    await generateModules(appPath, genProInd);

    if (QuestionAnswer.instance.isSupportStateManagement(AppConstant.StateManagement.ReactRedux)) {
      await generateRedux(appPath, genProInd);
    }

    if (
      QuestionAnswer.instance.isSupportStateManagementMiddleware(
        AppConstant.StateManagementMiddleware.ReduxSaga
      )
    ) {
      await generateSaga(appPath, genProInd);
    }

    await generateThemes(appPath, genProInd);

    await generateTranslations(appPath, genProInd);

    await generateTypes(appPath, genProInd);

    await generateUtils(appPath, genProInd);

    genProInd.changeMessage(
      {
        text: AppConstant.StringConstants.msgProjectTemplate,
        color: colors.task.done,
        modifiers: chalk.bold
      },
      'succeed'
    );

    const depsInstInd = Indicators.getInstance('NPM Install');
    depsInstInd.start();
    depsInstInd.changeMessage({
      text: AppConstant.StringConstants.msgDependencyInstall,
      color: colors.task.loading,
      modifiers: chalk.bold
    });

    await cmdRunner('git', ['init'], { cwd: QuestionAnswer.instance.getProjectName });
    await cmdRunner('git', ['add', '-A'], { cwd: QuestionAnswer.instance.getProjectName });

    // TODO Uncomment this code when yarn berry support is added
    // if (QuestionAnswer.instance.isSupportPackageManager(AppConstant.PackageManager.Yarn)) {
    //   await cmdRunner('yarn', ['set', 'version', 'berry'], {
    //     cwd: QuestionAnswer.instance.getProjectName
    //   });
    // }

    await cmdRunner(
      QuestionAnswer.instance.getPackageManager,
      QuestionAnswer.instance.isSupportPackageManager(AppConstant.PackageManager.Yarn)
        ? []
        : ['install'],
      { cwd: QuestionAnswer.instance.getProjectName }
    );

    depsInstInd.changeMessage(
      {
        text: AppConstant.StringConstants.msgDependencyInstall,
        color: colors.task.done,
        modifiers: chalk.bold
      },
      'succeed'
    );

    genInd.changeMessage(
      {
        text: AppConstant.StringConstants.msgProjectSuccess,
        color: colors.success,
        modifiers: chalk.bold
      },
      'succeed'
    );
    process.exit(0);
  } catch (error) {
    showError(error, genInd, colors);
  }
};
