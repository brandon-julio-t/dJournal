// Import the Hardhat testing framework
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { JournalContractImplV1 } from '../typechain-types';

describe('JournalContractImplV1', function () {
  let contract: JournalContractImplV1;

  this.beforeEach(async () => {
    contract = await ethers.deployContract('JournalContractImplV1');
  });

  describe('createJournal', function () {
    it('creates a new journal into journalDb with correct data', async () => {
      const title = 'Hello World';
      const body = 'I am borne into the world again!';

      const response = await contract.createJournal(title, body);
      const responseBlock = await response.getBlock();
      const [journal] = await contract.getMyJournals();

      expect(journal[0]).to.equal(title);
      expect(journal[1]).to.equal(body);
      expect(journal[2]).to.be.true;
      expect(journal[3]).to.equal(responseBlock?.timestamp);
      expect(journal[4]).to.equal(responseBlock?.timestamp);
      expect(journal[5]).to.equal(0);
    });
  });

  describe('getMyJournals', () => {
    it('only returns my journal', async () => {
      const [alice, bob] = await ethers.getSigners();

      const aliceTitle = 'at';
      const aliceBody = 'ab';

      const bobTitle = 'bt';
      const bobBody = 'bb';

      const aliceContract = contract.connect(alice);
      const bobContract = contract.connect(bob);

      await aliceContract.createJournal(aliceTitle, aliceBody);
      await bobContract.createJournal(bobTitle, bobBody);

      const aliceJournals = await aliceContract.getMyJournals();
      const bobJournals = await bobContract.getMyJournals();

      expect(aliceJournals.length).to.equal(1);
      expect(aliceJournals[0][0]).to.equal(aliceTitle);
      expect(aliceJournals[0][1]).to.equal(aliceBody);
      expect(bobJournals.length).to.equal(1);
      expect(bobJournals[0][0]).to.equal(bobTitle);
      expect(bobJournals[0][1]).to.equal(bobBody);
    });
  });

  describe('updateJournal', () => {
    it('can update existing journal', async () => {
      await contract.createJournal('t_v1', 'b_v1');
      await contract.createJournal('t_v1', 'b_v1');

      await contract.updateJournal(0, 't_v2', 'b_v2');
      await contract.updateJournal(1, 't_v2', 'b_v2');

      const [j1, j2] = await contract.getMyJournals();

      expect(j1[0]).to.equal('t_v2');
      expect(j1[1]).to.equal('b_v2');

      expect(j2[0]).to.equal('t_v2');
      expect(j2[1]).to.equal('b_v2');
    });

    it('cannot update journal that is not initialized', async () => {
      await expect(contract.updateJournal(0, 'a', 'b')).to.be.rejected;
    });

    it('cannot update journal that is deleted', async () => {
      await contract.createJournal('t', 'b');

      await contract.deleteJournal(0);

      await expect(contract.updateJournal(0, 'a', 'b')).to.be.rejected;
    });
  });

  describe('deleteJournal', () => {
    it('can delete existing journal', async () => {
      await contract.createJournal('t', 'b');

      await contract.deleteJournal(0);

      const [j] = await contract.getMyJournals();

      expect(j.at(-1)).not.to.equal(0);
    });

    it('cannot delete journal that is not initialized', async () => {
      await expect(contract.deleteJournal(0)).to.be.rejected;
    });

    it('cannot delete journal that is already deleted', async () => {
      await contract.createJournal('t', 'b');

      await contract.deleteJournal(0);

      await expect(contract.deleteJournal(0)).to.be.rejected;
    });
  });

  it('should respond to ping', async function () {
    const result = await contract.ping();
    expect(result).to.equal('pong');
  });
});
