#! /usr/bin/env node

import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import gradient from 'gradient-string';
import {
  AppConstant,
  getTheme,
  askQuestions,
  QuestionAnswer,
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
  generateTypes,
  copyFiles,
  logger,
  Indicators,
  cmdRunner,
  showError,
  updateYamlFile,
  addSpaces
} from './src/index.js';
import { getDependencies } from './template/index.js';

/**
 * The main function of the CLI.
 *
 * This function is the entry point of the CLI. It will:
 * - Display a welcome message and the project name
 * - Ask questions to the user
 * - Generate the project structure
 * - Copy the necessary files
 * - Install the dependencies
 * - Pre-build the project for native modules
 *
 * If any error occurs, it will display an error message and exit the process.
 */
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
      text: addSpaces(AppConstant.StringConstants.simformTitle, 10),
      modifiers: chalk.bold,
      color: colors.title
    });
    logger({
      text: addSpaces(AppConstant.StringConstants.welcome, 0),
      modifiers: chalk.bold.italic.dim,
      color: colors.title
    });
    logger({
      text: addSpaces(AppConstant.StringConstants.welcomeProject, 3),
      modifiers: chalk.bold.italic.dim,
      color: colors.title
    });

    const queInd = Indicators.getInstance('Questionnaire');
    await askQuestions(queInd);

    // eslint-disable-next-line no-restricted-syntax
    console.log('');
    const genProInd = Indicators.getInstance('Project Generate');
    genProInd.changeMessage({
      text: AppConstant.StringConstants.msgProjectTemplate,
      color: colors.task.idle,
      modifiers: chalk.bold
    });
    const depsInstInd = Indicators.getInstance('NPM Install');
    depsInstInd.changeMessage({
      text: AppConstant.StringConstants.msgDependencyInstall,
      color: colors.task.idle,
      modifiers: chalk.bold
    });
    const preBuildInstInd = Indicators.getInstance('Pre Requisite');
    preBuildInstInd.changeMessage({
      text: AppConstant.StringConstants.msgNativeModules,
      color: colors.task.idle,
      modifiers: chalk.bold
    });

    // Create project directories if they don't exist
    const projectPath = path.join(process.cwd(), QuestionAnswer.instance.getProjectName);
    await fs.mkdir(projectPath, { recursive: true });

    // Create app directory if it doesn't exist
    const appPath = path.join(projectPath, 'app');
    await fs.mkdir(appPath, { recursive: true });

    genProInd.start();
    genProInd.changeMessage({
      text: AppConstant.StringConstants.msgProjectTemplate,
      color: colors.task.loading,
      modifiers: chalk.bold
    });
    await generateProject(projectPath, genProInd);

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

    await copyFiles(appPath, genProInd);

    genProInd.changeMessage(
      {
        text: AppConstant.StringConstants.msgProjectTemplate,
        color: colors.task.done,
        modifiers: chalk.bold
      },
      'succeed'
    );

    depsInstInd.start();
    depsInstInd.changeMessage({
      text: AppConstant.StringConstants.msgDependencyInstall,
      color: colors.task.loading,
      modifiers: chalk.bold
    });

    await cmdRunner('git', ['init'], { cwd: QuestionAnswer.instance.getProjectName });
    await cmdRunner('git', ['add', '-A'], { cwd: QuestionAnswer.instance.getProjectName });

    if (QuestionAnswer.instance.isSupportPackageManager(AppConstant.PackageManager.Yarn)) {
      await cmdRunner('yarn', ['set', 'version', 'berry'], {
        cwd: QuestionAnswer.instance.getProjectName
      });

      updateYamlFile(
        path.join(projectPath, '.yarnrc.yml'),
        'nodeLinker',
        QuestionAnswer.instance.getYarnV4NodeLinkerValue
      );
    }

    const { dependencies, devDependencies } = getDependencies();
    await cmdRunner(
      QuestionAnswer.instance.getPackageManager,
      QuestionAnswer.instance.isSupportPackageManager(AppConstant.PackageManager.Npm)
        ? ['install', ...dependencies, '--save', '--force']
        : ['add', ...dependencies],
      { cwd: QuestionAnswer.instance.getProjectName }
    );

    await cmdRunner(
      QuestionAnswer.instance.getPackageManager,
      QuestionAnswer.instance.isSupportPackageManager(AppConstant.PackageManager.Npm)
        ? ['install', ...devDependencies, '--save-dev', '--force']
        : ['add', '-D', ...devDependencies],
      { cwd: QuestionAnswer.instance.getProjectName }
    );

    await cmdRunner('npx', ['expo', 'install', '--fix'], {
      cwd: QuestionAnswer.instance.getProjectName
    });

    depsInstInd.changeMessage(
      {
        text: AppConstant.StringConstants.msgDependencyInstall,
        color: colors.task.done,
        modifiers: chalk.bold
      },
      'succeed'
    );

    // preBuildInstInd.start();
    // preBuildInstInd.changeMessage({
    //   text: AppConstant.StringConstants.msgNativeModules,
    //   color: colors.task.loading,
    //   modifiers: chalk.bold
    // });

    // await cmdRunner('npx', ['expo', 'prebuild'], {
    //   cwd: QuestionAnswer.instance.getProjectName
    // });

    // preBuildInstInd.changeMessage(
    //   {
    //     text: AppConstant.StringConstants.msgNativeModules,
    //     color: colors.task.done,
    //     modifiers: chalk.bold
    //   },
    //   'succeed'
    // );

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

/**
 *
 *                                                      ##
 *                                                    #####
 *                                                #########
 *                                             ############
 *                                          ##################
 *                                       ########################
 *                                       #############    ##########
 *                                       ##########       ##############
 *                                       #########        #################
 *                                       ############         ##############
 *                                       ###############         ###########
 *                                         ################         ########
 *                                            #############      ###########
 *                                                #########  ###############
 *                                                   ######################
 *                                                      ################
 *                                                        ##########
 *                                                        #######
 *                                                        ####
 *                                                        #
 *
 *    ######       ####     ####          ####     ############        ######         ##########        ####          ###
 *  ##########     ####      ####         ####      ###########     ############      ############      #####        #####
 * ####    ####    ####     ######       #####      ###           #####      #####    ####     ####     ######      ######
 * #####           ####     #######     ######      ###          ####         ####    ####     ####     #######    #######
 *  #########      ####     ########   ### ####     #########    ####          ####   #############    #### ####  #### ###
 *       ######    ####     ###  #### ###  ####     #########    ####          ####   ###########      ####  ########  ####
 * ####     ###    ####    ####   ######    ###     ###           ####       #####    ####  ####       ####   ######   ####
 * ############    ####    ####    ####     ###     ###            ##############     ####   #####     ###     ####    ####
 *   #########     ####    ####             ####    ###              #########        ####     ####   ####              ###
 */
main();
