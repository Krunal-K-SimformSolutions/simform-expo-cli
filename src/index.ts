import { logger, Indicators } from './utils';
import { generateProject } from './GenerateProject';
import { askQuestions } from './questions';
import AppConstant from './AppConstant';

export const main = async () => {
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
      color: 'redBright'
    });
    logger({
      text: `         Simform Solutions Pvt. Ltd.\n\n`,
      color: 'redBright',
      modifiers: 'bold'
    });

    await askQuestions();

    await generateProject(Indicators.instance);

    Indicators.instance.changeMessage(
      {
        text: AppConstant.StringConstants.msgProjectSuccess,
        color: 'greenBright',
        modifiers: 'bold'
      },
      'succeed'
    );
  } catch (error) {
    Indicators.instance.changeMessage(
      {
        text: AppConstant.StringConstants.msgProjectError((error as Error).message),
        color: 'redBright',
        modifiers: 'bold'
      },
      'fail'
    );
  }
};

export { QuestionAnswer } from './questions';
